import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, session: null, isLoading: true });

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (!isMounted) return;
      setState({ user: session?.user ?? null, session: session ?? null, isLoading: false });
    };

    bootstrap();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setState({ user: session?.user ?? null, session: session ?? null, isLoading: false });
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return state;
}


