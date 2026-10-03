import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Product, getImageUri } from '../lib/products';

type ProductCardProps = {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
};

export default function ProductCard({ product, onPress, onAddToCart }: ProductCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress?.(product)}
      android_ripple={{ color: '#d1fae5' }}
    >
      <Image source={{ uri: getImageUri(product.image) }} style={styles.image} resizeMode="cover" />

      <View style={styles.badgeWrap}>
        <Text style={styles.badge}>{product.badge}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name}>{product.name}</Text>

        <View style={styles.ratingRow}>
          <Text>⭐ {product.rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({product.reviewsCount})</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₦{product.price.toLocaleString()}</Text>
          <Text style={styles.original}>₦{product.originalPrice.toLocaleString()}</Text>
        </View>

        <Pressable
          style={styles.cta}
          onPress={() => onAddToCart?.(product)}
        >
          <Text style={styles.ctaText}>Add to cart</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 210,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#ecfdf5',
  },
  badgeWrap: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#0b7c4e',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badge: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  body: {
    padding: 12,
  },
  brand: {
    color: '#0f766e',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  reviews: {
    color: '#64748b',
    marginLeft: 4,
    fontSize: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  price: {
    color: '#0b7c4e',
    fontSize: 18,
    fontWeight: '800',
  },
  original: {
    color: '#94a3b8',
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  cta: {
    marginTop: 12,
    backgroundColor: '#0b7c4e',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});
