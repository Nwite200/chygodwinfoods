import { ScrollView, StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import CategoryChip from '../components/CategoryChip';
import ProductCard from '../components/ProductCard';
import { CATEGORIES, PRODUCTS, getImageUri } from '../lib/products';
import { useCart } from '../lib/cart';
import CartSyncNotice from '../components/CartSyncNotice';

export default function HomeScreen() {
  const router = useRouter();
  const { items, addItem, syncError } = useCart();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const featuredProducts = PRODUCTS.filter((product) => product.featured).slice(0, 6);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.eyebrow}>Fresh food delivery</Text>
          <Text style={styles.logo}>CHYGODWIN</Text>
        </View>

        <Pressable style={styles.cartButton} onPress={() => router.push('/cart')}>
          <Text style={styles.cartText}>Cart ({cartCount})</Text>
        </Pressable>
      </View>

      <CartSyncNotice message={syncError} />

      <View style={styles.heroCard}>
        <Text style={styles.heroTag}>New drops</Text>
        <Text style={styles.heroTitle}>Healthy pantry staples for your home</Text>
        <Text style={styles.heroBody}>From grains to kitchen essentials, shop your weekly groceries in minutes.</Text>

        <View style={styles.heroActions}>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/products')}>
            <Text style={styles.primaryButtonText}>Shop now</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => router.push('/account')}>
            <Text style={styles.secondaryButtonText}>My account</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Shop by category</Text>
        <Pressable onPress={() => router.push('/products')}>
          <Text style={styles.linkText}>See all</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
        {CATEGORIES.map((item) => (
          <CategoryChip key={item.id} item={item} onPress={(categoryId) => router.push({ pathname: '/products', params: { category: categoryId } })} />
        ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured products</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productRow}>
        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPress={() => router.push({ pathname: `/product/${product.id}` })}
            onAddToCart={addItem}
          />
        ))}
      </ScrollView>

      <View style={styles.miniBanner}>
        <Image source={{ uri: getImageUri('/products/garri.jpg') }} style={styles.bannerImage} />
        <View style={styles.bannerTextWrap}>
          <Text style={styles.bannerTitle}>Fresh from the market</Text>
          <Text style={styles.bannerBody}>Discover premium grains, pantry essentials and household staples.</Text>
        </View>
      </View>
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
    paddingBottom: 42,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  eyebrow: {
    color: '#0f766e',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  logo: {
    color: '#0b7c4e',
    fontWeight: '900',
    fontSize: 22,
    letterSpacing: 2,
  },
  cartButton: {
    backgroundColor: '#0b7c4e',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  cartText: {
    color: '#fff',
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: '#0b7c4e',
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
  },
  heroTag: {
    color: '#dcfce7',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginTop: 8,
  },
  heroBody: {
    color: '#d1fae5',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  heroActions: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#0b7c4e',
    fontWeight: '800',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '800',
  },
  linkText: {
    color: '#0b7c4e',
    fontWeight: '700',
  },
  categoryRow: {
    paddingVertical: 6,
    paddingRight: 12,
  },
  productRow: {
    paddingVertical: 6,
    paddingRight: 12,
  },
  miniBanner: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#dfe7df',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerImage: {
    width: 110,
    height: 110,
  },
  bannerTextWrap: {
    flex: 1,
    padding: 16,
  },
  bannerTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
  bannerBody: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
});
