import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../lib/products';
import { useCart } from '../lib/cart';
import CartSyncNotice from '../components/CartSyncNotice';

export default function ProductsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { addItem, syncError } = useCart();
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    const category = typeof params.category === 'string' ? params.category : '';
    return PRODUCTS.filter((product) => {
      const matchesCategory = !category || product.category === category;
      const matchesSearch = !search || product.name.toLowerCase().includes(search.toLowerCase()) || product.brand.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [params.category, search]);

  useEffect(() => {
    if (params.category) {
      // keep the screen in sync when the selected category changes
    }
  }, [params.category]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Products</Text>
        <Pressable onPress={() => router.push('/cart')} style={styles.cartButton}>
          <Text style={styles.cartButtonText}>Cart</Text>
        </Pressable>
      </View>

      <TextInput
        value={search}
        onChangeText={setSearch}
        style={styles.search}
        placeholder="Search products or brands"
      />

      <CartSyncNotice message={syncError} />

      <ScrollView contentContainerStyle={styles.grid}>
        {filteredProducts.length ? (
          filteredProducts.map((product) => (
            <Pressable key={product.id} onPress={() => router.push({ pathname: `/product/${product.id}` })}>
              <ProductCard product={product} onPress={() => router.push({ pathname: `/product/${product.id}` })} onAddToCart={addItem} />
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyText}>Try a different product or category.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  cartButton: {
    backgroundColor: '#0b7c4e',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  search: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dfe7df',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 18,
    color: '#0f172a',
  },
  grid: {
    paddingBottom: 28,
    alignItems: 'center',
    gap: 18,
  },
  emptyWrap: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    color: '#475569',
    marginTop: 8,
  },
});
