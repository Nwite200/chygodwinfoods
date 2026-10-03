import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../lib/cart';
import { getImageUri } from '../lib/products';
import CartSyncNotice from '../components/CartSyncNotice';

export default function CartScreen() {
  const router = useRouter();
  const { items, subtotal, updateQuantity, removeItem, syncError } = useCart();
  const total = useMemo(() => subtotal, [subtotal]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.title}>My cart</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.noticeWrap}>
        <CartSyncNotice message={syncError} />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {items.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>Add a product to begin sharing cart updates across devices.</Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.product_id} style={styles.card}>
              <Image source={{ uri: getImageUri(item.image) }} style={styles.image} />

              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>₦{item.price.toLocaleString()}</Text>

                <View style={styles.row}>
                  <Pressable style={styles.qtyButton} onPress={() => updateQuantity(item.product_id, Math.max(item.quantity - 1, 0))}>
                    <Text style={styles.qtyText}>−</Text>
                  </Pressable>

                  <Text style={styles.qtyTextValue}>{item.quantity}</Text>

                  <Pressable style={styles.qtyButton} onPress={() => updateQuantity(item.product_id, item.quantity + 1)}>
                    <Text style={styles.qtyText}>＋</Text>
                  </Pressable>

                  <Pressable style={styles.removeButton} onPress={() => removeItem(item.product_id)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Subtotal</Text>
          <Text style={styles.summaryValue}>₦{total.toLocaleString()}</Text>
        </View>

        <Pressable style={styles.checkoutButton} onPress={() => router.push('/products')}>
          <Text style={styles.checkoutText}>Continue shopping</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 18,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '900',
  },
  title: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '800',
  },
  placeholder: {
    width: 36,
    height: 36,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  noticeWrap: {
    paddingHorizontal: 16,
  },
  emptyWrap: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dfe7df',
    padding: 28,
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
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: '#ecfdf5',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 6,
  },
  price: {
    color: '#0b7c4e',
    fontWeight: '800',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: '#0b7c4e',
    fontSize: 18,
    fontWeight: '800',
  },
  qtyTextValue: {
    color: '#0f172a',
    fontWeight: '800',
    minWidth: 18,
    textAlign: 'center',
  },
  removeButton: {
    marginLeft: 'auto',
  },
  removeText: {
    color: '#dc2626',
    fontWeight: '700',
  },
  summary: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
  summaryValue: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '900',
  },
  checkoutButton: {
    marginTop: 18,
    backgroundColor: '#0b7c4e',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
});
