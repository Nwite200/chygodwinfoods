import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function SplashScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      if (!supabase) {
        router.replace('/login');
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!mounted) {
        return;
      }

      router.replace(data.session ? '/home' : '/login');
      setLoading(false);
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>CHYGODWIN</Text>
      <Text style={styles.subbrand}>Foodstuff Global</Text>
      {loading ? <ActivityIndicator size="large" color="#0b7c4e" style={{ marginTop: 20 }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 32,
    letterSpacing: 3,
    fontWeight: '900',
    color: '#0b7c4e',
  },
  subbrand: {
    fontSize: 14,
    letterSpacing: 1.4,
    color: '#166534',
    marginTop: 6,
    textTransform: 'uppercase',
  },
});
