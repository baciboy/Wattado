import { supabase } from './supabaseClient';
import { Event } from '../types/Event';

export interface FavouriteRecord {
  id: string;
  user_id: string;
  event_id: string;
  event_data: Event;
  created_at: string;
}

/**
 * Add an event to user's favourites
 */
export async function addFavourite(event: Event): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('favourites')
      .insert({
        user_id: user.id,
        event_id: event.id,
        event_data: event
      });

    if (error) {
      // Handle unique constraint violation (already favourited)
      if (error.code === '23505') {
        return { success: false, error: 'Event already in favourites' };
      }
      console.error('Error adding favourite:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error adding favourite:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Remove an event from user's favourites
 */
export async function removeFavourite(eventId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('favourites')
      .delete()
      .eq('user_id', user.id)
      .eq('event_id', eventId);

    if (error) {
      console.error('Error removing favourite:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error removing favourite:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Get all favourites for the current user
 */
export async function getFavourites(): Promise<{ favourites: Event[]; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { favourites: [], error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('favourites')
      .select('event_data, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favourites:', error);
      return { favourites: [], error: error.message };
    }

    const favourites = data?.map(item => item.event_data as Event) || [];
    return { favourites };
  } catch (err) {
    console.error('Unexpected error fetching favourites:', err);
    return { favourites: [], error: 'An unexpected error occurred' };
  }
}

/**
 * Check if an event is in user's favourites
 */
export async function isFavourite(eventId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('favourites')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking favourite:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Unexpected error checking favourite:', err);
    return false;
  }
}

/**
 * Get all favourite event IDs for the current user (for quick lookup)
 */
export async function getFavouriteIds(): Promise<Set<string>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Set();
    }

    const { data, error } = await supabase
      .from('favourites')
      .select('event_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching favourite IDs:', error);
      return new Set();
    }

    return new Set(data?.map(item => item.event_id) || []);
  } catch (err) {
    console.error('Unexpected error fetching favourite IDs:', err);
    return new Set();
  }
}
