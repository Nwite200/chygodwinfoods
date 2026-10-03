import { StyleSheet, Text, View } from 'react-native';

export default function CheckoutScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.subtitle}>This milestone is intentionally deferred until the realtime shared-cart flow works end-to-end.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    padding: 28,
  },
  title: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#475569',
    marginTop: 12,
    lineHeight: 22,
  },
});
