import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [session, setSession] = useState<any>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

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
      }
    };

    loadSession();
    const { data: authSubscription } = supabase
      ? supabase.auth.onAuthStateChange((_event, nextSession) => {
          setSession(nextSession);
        })
      : { data: { subscription: { unsubscribe: () => undefined } } };

    return () => {
      mounted = false;
      authSubscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      setItems([]);
      if (supabase) {
        setSyncError('Sign in to load your shared cart.');
      }
      return undefined;
    }

    let isMounted = true;

    const syncFromSupabase = async () => {
      try {
        const nextItems = await fetchCartForUser(session.user.id);
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

    const cleanup = createRealtimeSubscriptions(session.user.id, () => {
      syncFromSupabase();
    });

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [session?.user?.id]);

  const addItem = useCallback(
    async (product: Product) => {
      if (!supabase || !isSupabaseConfigured) {
        setSyncError('Configure Supabase before adding items to the shared cart.');
        return items;
      }

      if (!session?.user?.id) {
        setSyncError('Sign in before adding items to the shared cart.');
        return items;
      }

      const nextItems = [...items];
      const existingIndex = nextItems.findIndex((item) => item.product_id === product.id);

      if (existingIndex >= 0) {
        nextItems[existingIndex] = {
          ...nextItems[existingIndex],
          quantity: nextItems[existingIndex].quantity + 1,
          price: product.price,
          image: product.image,
          name: product.name,
        };
      } else {
        nextItems.push({
          id: product.id,
          product_id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: 1,
          brand: product.brand,
          user_id: session?.user?.id,
        });
      }

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

      return (await refreshItems(session.user.id)) ?? items;
    },
    [items, refreshItems, session?.user?.id],
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (!supabase || !isSupabaseConfigured) {
        setSyncError('Configure Supabase before changing the shared cart.');
        return items;
      }

      if (!session?.user?.id) {
        setSyncError('Sign in before changing the shared cart.');
        return items;
      }

      const nextItems = items
        .map((item) =>
          item.product_id === productId ? { ...item, quantity: Math.max(quantity, 0) } : item,
        )
        .filter((item) => item.quantity > 0);

      const query = quantity <= 0
        ? supabase.from(CART_TABLE).delete().eq('product_id', productId).eq('user_id', session.user.id)
        : supabase
            .from(CART_TABLE)
            .update({ quantity, updated_at: new Date().toISOString() })
            .eq('product_id', productId)
            .eq('user_id', session.user.id);
      const { error } = await query;

      if (error) {
        setSyncError(error.message);
        return items;
      }

      return (await refreshItems(session.user.id)) ?? items;
    },
    [items, refreshItems, session?.user?.id],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (!supabase || !isSupabaseConfigured) {
        setSyncError('Configure Supabase before changing the shared cart.');
        return items;
      }

      if (!session?.user?.id) {
        setSyncError('Sign in before changing the shared cart.');
        return items;
      }

      const nextItems = items.filter((item) => item.product_id !== productId);

      const { error } = await supabase
        .from(CART_TABLE)
        .delete()
        .eq('product_id', productId)
        .eq('user_id', session.user.id);

      if (error) {
        setSyncError(error.message);
        return items;
      }

      return (await refreshItems(session.user.id)) ?? items;
    },
    [items, refreshItems, session?.user?.id],
  );

  const clearCart = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) {
      setSyncError('Configure Supabase before changing the shared cart.');
      return;
    }

    if (!session?.user?.id) {
      setSyncError('Sign in before changing the shared cart.');
      return;
    }

    const { error } = await supabase.from(CART_TABLE).delete().eq('user_id', session.user.id);

    if (error) {
      setSyncError(error.message);
      return;
    }

    await refreshItems(session.user.id);
  }, [refreshItems, session?.user?.id]);

  const subtotal = useMemo(() => items.reduce((total, item) => total + item.price * item.quantity, 0), [items]);

  return {
    items,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    syncError,
  };
}
