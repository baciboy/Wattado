import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (error) {
          setState({ user: null, session: null, isLoading: false, error });
          console.error('Error getting session:', error);
          return;
        }

        setState({
          user: session?.user ?? null,
          session: session ?? null,
          isLoading: false,
          error: null
        });
      } catch (err) {
        if (!isMounted) return;
        const error = err instanceof Error ? err : new Error('Unknown error during auth initialization');
        setState({ user: null, session: null, isLoading: false, error });
        console.error('Error bootstrapping auth:', error);
      }
    };

    bootstrap();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setState({
        user: session?.user ?? null,
        session: session ?? null,
        isLoading: false,
        error: null
      });
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return state;
}


