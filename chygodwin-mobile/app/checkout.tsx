import { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../lib/cart';
import { WEBSITE_BASE_URL } from '../lib/products';

const DELIVERY_FEE = 1500;

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const [openingWebsite, setOpeningWebsite] = useState(false);
  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  const handleOpenWebsiteCheckout = async () => {
    try {
      setOpeningWebsite(true);
      await Linking.openURL(WEBSITE_BASE_URL);
    } catch (error) {
      Alert.alert(
        'Unable to open the website',
        error instanceof Error ? error.message : 'Please open chygodwinfoods.netlify.app in your browser.',
      );
    } finally {
      setOpeningWebsite(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.intro}>
          Your cart is shared with the ChyGodwin Foods website. Continue there to enter delivery details and place your order.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order summary</Text>
          {items.length === 0 ? (
            <Text style={styles.emptyText}>Your shared cart is empty. Add products before checking out.</Text>
          ) : (
            items.map((item) => (
              <View key={item.product_id} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>Qty {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>₦{(item.price * item.quantity).toLocaleString()}</Text>
              </View>
            ))
          )}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₦{subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Standard delivery</Text>
            <Text style={styles.summaryValue}>{items.length > 0 ? `₦${DELIVERY_FEE.toLocaleString()}` : '—'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Estimated total</Text>
            <Text style={styles.totalValue}>₦{total.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Finish on the website</Text>
          <Text style={styles.noticeBody}>
            Sign in there with the same account used in this app. Your cart will appear on the website before you continue to delivery and payment.
          </Text>
          <Text style={styles.demoDisclaimer}>
            The website checkout is currently a demonstration and does not process real card payments or save production orders.
          </Text>
        </View>

        <Pressable
          style={[styles.primaryButton, (items.length === 0 || openingWebsite) && styles.disabledButton]}
          onPress={handleOpenWebsiteCheckout}
          disabled={items.length === 0 || openingWebsite}
        >
          <Text style={styles.primaryButtonText}>{openingWebsite ? 'Opening website...' : 'Continue on website'}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
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
  backButtonText: { color: '#0f172a', fontSize: 20, fontWeight: '900' },
  title: { color: '#0f172a', fontSize: 22, fontWeight: '800' },
  placeholder: { width: 36, height: 36 },
  content: { padding: 18, paddingBottom: 36 },
  intro: { color: '#475569', fontSize: 15, lineHeight: 22, marginBottom: 18 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dfe7df',
    padding: 18,
  },
  sectionTitle: { color: '#0f172a', fontSize: 18, fontWeight: '800', marginBottom: 14 },
  emptyText: { color: '#64748b', lineHeight: 21, marginBottom: 8 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 10 },
  itemInfo: { flex: 1 },
  itemName: { color: '#0f172a', fontWeight: '700' },
  itemQuantity: { color: '#64748b', marginTop: 4, fontSize: 13 },
  itemPrice: { color: '#0f172a', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  summaryLabel: { color: '#64748b', fontWeight: '600' },
  summaryValue: { color: '#0f172a', fontWeight: '700' },
  totalLabel: { color: '#0f172a', fontSize: 16, fontWeight: '800' },
  totalValue: { color: '#0b7c4e', fontSize: 18, fontWeight: '900' },
  notice: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
  },
  noticeTitle: { color: '#166534', fontWeight: '800', marginBottom: 6 },
  noticeBody: { color: '#166534', lineHeight: 20, fontSize: 13 },
  demoDisclaimer: { color: '#7c2d12', lineHeight: 19, fontSize: 12, marginTop: 10 },
  primaryButton: {
    backgroundColor: '#0b7c4e',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 18,
  },
  disabledButton: { opacity: 0.5 },
  primaryButtonText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
