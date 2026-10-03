import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PRODUCTS, getImageUri } from '../../lib/products';
import { useCart } from '../../lib/cart';
import CartSyncNotice from '../../components/CartSyncNotice';

export function generateStaticParams(): { id: string }[] {
  return PRODUCTS.map((product) => ({ id: product.id }));
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem, syncError } = useCart();
  const product = PRODUCTS.find((item) => item.id === id) ?? PRODUCTS[0];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <Text style={styles.iconText}>←</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/cart')} style={styles.cartButton}>
          <Text style={styles.cartText}>Cart</Text>
        </Pressable>
      </View>

      <Image source={{ uri: getImageUri(product.image) }} style={styles.mainImage} resizeMode="cover" />

      <View style={styles.badgeWrap}>
        <Text style={styles.badge}>{product.badge}</Text>
      </View>

      <Text style={styles.category}>{product.categoryName}</Text>
      <Text style={styles.name}>{product.name}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>₦{product.price.toLocaleString()}</Text>
        <Text style={styles.original}>₦{product.originalPrice.toLocaleString()}</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>⭐ {product.rating.toFixed(1)}</Text>
        <Text style={styles.meta}>({product.reviewsCount} reviews)</Text>
        <Text style={styles.meta}>{product.inStock ? 'In stock' : 'Out of stock'}</Text>
      </View>

      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.featureBox}>
        <Text style={styles.sectionTitle}>Why shoppers love it</Text>
        {product.features.map((feature) => (
          <Text key={feature} style={styles.feature}>• {feature}</Text>
        ))}
      </View>

      <Pressable style={styles.primaryButton} onPress={() => addItem(product)}>
        <Text style={styles.primaryButtonText}>Add to cart</Text>
      </Pressable>
      <CartSyncNotice message={syncError} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    padding: 18,
    paddingBottom: 60,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 32,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  cartButton: {
    backgroundColor: '#0b7c4e',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cartText: {
    color: '#fff',
    fontWeight: '700',
  },
  mainImage: {
    width: '100%',
    height: 320,
    borderRadius: 22,
    backgroundColor: '#ecfdf5',
  },
  badgeWrap: {
    alignSelf: 'flex-start',
    marginTop: 14,
    backgroundColor: '#0b7c4e',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badge: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  category: {
    color: '#0f766e',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 12,
  },
  name: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  price: {
    color: '#0b7c4e',
    fontSize: 26,
    fontWeight: '900',
  },
  original: {
    color: '#94a3b8',
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  meta: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  description: {
    color: '#334155',
    lineHeight: 22,
    marginTop: 16,
    fontSize: 15,
  },
  featureBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dfe7df',
    padding: 16,
    marginTop: 20,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  feature: {
    color: '#334155',
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#0b7c4e',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 22,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
