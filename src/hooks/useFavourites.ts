import { useState, useEffect, useCallback } from 'react';
import { Event } from '../types/Event';
import {
  addFavourite,
  removeFavourite,
  getFavourites,
  getFavouriteIds
} from '../services/favouritesService';
import { useAuth } from './useAuth';

export function useFavourites() {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState<Event[]>([]);
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load favourites when user logs in
  useEffect(() => {
    if (!user) {
      setFavourites([]);
      setFavouriteIds(new Set());
      setIsLoading(false);
      return;
    }

    const loadFavourites = async () => {
      setIsLoading(true);
      setError(null);

      // Load both full favourites and IDs
      const [favouritesResult, idsResult] = await Promise.all([
        getFavourites(),
        getFavouriteIds()
      ]);

      if (favouritesResult.error) {
        setError(favouritesResult.error);
      } else {
        setFavourites(favouritesResult.favourites);
      }

      setFavouriteIds(idsResult);
      setIsLoading(false);
    };

    loadFavourites();
  }, [user]);

  // Check if an event is favourited
  const isFavourited = useCallback((eventId: string): boolean => {
    return favouriteIds.has(eventId);
  }, [favouriteIds]);

  // Toggle favourite status
  const toggleFavourite = useCallback(async (event: Event): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to add favourites');
      return false;
    }

    const eventId = event.id;
    const isCurrentlyFavourited = favouriteIds.has(eventId);

    // Optimistically update UI
    if (isCurrentlyFavourited) {
      setFavouriteIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
      setFavourites(prev => prev.filter(e => e.id !== eventId));
    } else {
      setFavouriteIds(prev => new Set(prev).add(eventId));
      setFavourites(prev => [event, ...prev]);
    }

    // Make API call
    const result = isCurrentlyFavourited
      ? await removeFavourite(eventId)
      : await addFavourite(event);

    if (!result.success) {
      // Revert optimistic update on error
      if (isCurrentlyFavourited) {
        setFavouriteIds(prev => new Set(prev).add(eventId));
        setFavourites(prev => [event, ...prev]);
      } else {
        setFavouriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
        setFavourites(prev => prev.filter(e => e.id !== eventId));
      }
      setError(result.error || 'Failed to update favourite');
      return false;
    }

    setError(null);
    return true;
  }, [user, favouriteIds]);

  // Refresh favourites from server
  const refresh = useCallback(async () => {
    if (!user) {
      setFavourites([]);
      setFavouriteIds(new Set());
      return;
    }

    setIsLoading(true);
    const [favouritesResult, idsResult] = await Promise.all([
      getFavourites(),
      getFavouriteIds()
    ]);

    if (favouritesResult.error) {
      setError(favouritesResult.error);
    } else {
      setFavourites(favouritesResult.favourites);
    }

    setFavouriteIds(idsResult);
    setIsLoading(false);
  }, [user]);

  return {
    favourites,
    favouriteIds,
    isLoading,
    error,
    isFavourited,
    toggleFavourite,
    refresh
  };
}
