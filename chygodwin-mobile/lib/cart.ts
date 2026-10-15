import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Product, getImageUri } from './products';
import { supabase, isSupabaseConfigured } from './supabase';

export type CartItem = {
  id: string;
  product_id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  brand?: string;
  user_id?: string;
};

const CART_TABLE = 'cart_items';
let realtimeChannelSequence = 0;

const normalizeCartRow = (row: Record<string, unknown>): CartItem => ({
  id: String(row.product_id),
  product_id: String(row.product_id),
  name: String(row.product_name ?? 'Product'),
  image: getImageUri(String(row.product_image ?? '')),
  price: Number(row.price ?? 0),
  quantity: Number(row.quantity ?? 1),
  user_id: String(row.user_id ?? ''),
});

const fetchCartForUser = async (userId: string): Promise<CartItem[]> => {
  if (!supabase || !isSupabaseConfigured) {
    return [];
  }

  const { data, error } = await supabase
    .from(CART_TABLE)
    .select('user_id, product_id, product_name, product_image, price, quantity, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => normalizeCartRow(row));
};

const createRealtimeSubscriptions = (userId: string, onChange: () => void) => {
  if (!supabase || !userId || !isSupabaseConfigured) {
    return () => undefined;
  }

  const channel = supabase
    .channel(`cart-sync-${userId}-${++realtimeChannelSequence}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: CART_TABLE,
        filter: `user_id=eq.${userId}`,
      },
      onChange,
    )
    .subscribe();

  return () => {
    void channel.unsubscribe();
  };
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const userId = session?.user.id;

  const refreshItems = useCallback(async (userId: string) => {
    try {
      const nextItems = await fetchCartForUser(userId);
      setItems(nextItems);
      setSyncError(null);
      return nextItems;
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Unable to sync the cart.');
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      if (!supabase) {
        setSession(null);
        setSyncError('Configure the Supabase project URL and publishable key to use the shared cart.');
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setSession(data.session);
        if (!data.session) {
          setItems([]);
          setSyncError('Sign in to load your shared cart.');
        }
      }
    };

    loadSession();
    const { data: authSubscription } = supabase
      ? supabase.auth.onAuthStateChange((_event, nextSession) => {
          setSession(nextSession);
          if (!nextSession) {
            setItems([]);
            setSyncError('Sign in to load your shared cart.');
          }
        })
      : { data: { subscription: { unsubscribe: () => undefined } } };

    return () => {
      mounted = false;
      authSubscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    let isMounted = true;

    const syncFromSupabase = async () => {
      try {
        const nextItems = await fetchCartForUser(userId);
        if (isMounted) {
          setItems(nextItems);
          setSyncError(null);
        }
      } catch (error) {
        if (isMounted) {
          setSyncError(error instanceof Error ? error.message : 'Unable to sync the cart.');
        }
      }
    };

    syncFromSupabase();

    const cleanup = createRealtimeSubscriptions(userId, () => {
      syncFromSupabase();
    });

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [userId]);

  const addItem = useCallback(
    async (product: Product) => {
      if (!supabase || !isSupabaseConfigured) {
        setSyncError('Configure Supabase before adding items to the shared cart.');
        return items;
      }

      if (!userId) {
        setSyncError('Sign in before adding items to the shared cart.');
        return items;
      }

      try {
        const { error } = await supabase.rpc('add_cart_item', {
          p_product_id: product.id,
          p_product_name: product.name,
          p_product_image: product.image,
          p_price: product.price,
        });
        if (error) {
          setSyncError(error.message);
          return items;
        }
        return (await refreshItems(userId)) ?? items;
      } catch (error) {
        setSyncError(error instanceof Error ? error.message : 'Unable to add the item to your shared cart.');
        return items;
      }
    },
    [items, refreshItems, userId],
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (!supabase || !isSupabaseConfigured) {
        setSyncError('Configure Supabase before changing the shared cart.');
        return items;
      }

      if (!userId) {
        setSyncError('Sign in before changing the shared cart.');
        return items;
      }

      try {
        const query = quantity <= 0
          ? supabase.from(CART_TABLE).delete().eq('product_id', productId).eq('user_id', userId)
          : supabase
              .from(CART_TABLE)
              .update({ quantity, updated_at: new Date().toISOString() })
              .eq('product_id', productId)
              .eq('user_id', userId);
        const { error } = await query;
        if (error) {
          setSyncError(error.message);
          return items;
        }
        return (await refreshItems(userId)) ?? items;
      } catch (error) {
        setSyncError(error instanceof Error ? error.message : 'Unable to update your shared cart.');
        return items;
      }
    },
    [items, refreshItems, userId],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (!supabase || !isSupabaseConfigured) {
        setSyncError('Configure Supabase before changing the shared cart.');
        return items;
      }

      if (!userId) {
        setSyncError('Sign in before changing the shared cart.');
        return items;
      }

      try {
        const { error } = await supabase
          .from(CART_TABLE)
          .delete()
          .eq('product_id', productId)
          .eq('user_id', userId);
        if (error) {
          setSyncError(error.message);
          return items;
        }
        return (await refreshItems(userId)) ?? items;
      } catch (error) {
        setSyncError(error instanceof Error ? error.message : 'Unable to remove the item from your shared cart.');
        return items;
      }
    },
    [items, refreshItems, userId],
  );

  const clearCart = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) {
      setSyncError('Configure Supabase before changing the shared cart.');
      return;
    }

    if (!userId) {
      setSyncError('Sign in before changing the shared cart.');
      return;
    }

    try {
      const { error } = await supabase.from(CART_TABLE).delete().eq('user_id', userId);
      if (error) {
        setSyncError(error.message);
        return;
      }
      await refreshItems(userId);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Unable to clear your shared cart.');
      return;
    }
  }, [refreshItems, userId]);

  const subtotal = useMemo(() => items.reduce((total, item) => total + item.price * item.quantity, 0), [items]);

  return {
    items,
    session,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    syncError,
  };
}
