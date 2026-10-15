import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useCart } from '../lib/cart';

export default function AccountScreen() {
  const router = useRouter();
  const { session } = useCart();

  const handleLogout = async () => {
    if (!supabase) {
      router.replace('/login');
      return;
    }

    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Account</Text>
      <Text style={styles.subtitle}>Your shared cart and profile details are stored via the same Supabase project as the web app.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profile</Text>
        <Text style={styles.cardText}>
          {session?.user.email ?? 'Sign in with the same account you use on the website to sync your cart.'}
        </Text>
      </View>

      {!session ? (
        <Pressable style={styles.button} onPress={() => router.push('/login')}>
          <Text style={styles.buttonText}>Sign in or create account</Text>
        </Pressable>
      ) : null}

      <Pressable style={styles.button} onPress={() => router.push('/orders')}>
        <Text style={styles.buttonText}>View orders</Text>
      </Pressable>

      {session ? (
        <Pressable style={styles.secondaryButton} onPress={handleLogout}>
          <Text style={styles.secondaryButtonText}>Logout</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#475569',
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dfe7df',
    padding: 18,
    marginTop: 24,
  },
  cardTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
  cardText: {
    color: '#475569',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#0b7c4e',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: '#e2e8f0',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontWeight: '800',
  },
});
