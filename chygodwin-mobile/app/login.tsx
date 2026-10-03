import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [canResendConfirmation, setCanResendConfirmation] = useState(false);

  const handleLogin = async () => {
    if (!supabase) {
      Alert.alert('Supabase not configured', 'Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY to your mobile environment.');
      return;
    }

    if (!email || !password) {
      Alert.alert('Missing details', 'Enter both email and password to continue.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        if (error.code === 'email_not_confirmed' || error.message.toLowerCase().includes('email not confirmed')) {
          setNotice('Confirm your email before signing in. You can request another confirmation link below.');
          setCanResendConfirmation(true);
          return;
        }

        setCanResendConfirmation(false);
        Alert.alert('Login failed', error.message);
        return;
      }

      setNotice(null);
      router.replace('/home');
    } catch (error) {
      Alert.alert('Unexpected error', error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!supabase || !email.trim()) {
      return;
    }

    try {
      setResending(true);
      const { error } = await supabase.auth.resend({ type: 'signup', email: email.trim() });
      setNotice(error ? error.message : `A new confirmation link was sent to ${email.trim()}.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to resend the confirmation email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.brand}>CHYGODWIN</Text>
          <Text style={styles.subtitle}>Welcome back</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="email@example.com"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            placeholder="••••••••"
          />

          {notice ? (
            <View style={styles.notice}>
              <Text style={styles.noticeText}>{notice}</Text>
              {canResendConfirmation ? (
                <Pressable onPress={handleResendConfirmation} disabled={resending}>
                  <Text style={styles.noticeAction}>{resending ? 'Sending...' : 'Resend confirmation email'}</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          <Pressable onPress={handleLogin} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{loading ? 'Signing in...' : 'Login'}</Text>
          </Pressable>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Need an account?</Text>
            <Link href="/register" asChild>
              <Pressable>
                <Text style={styles.linkText}>Register</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brand: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#0b7c4e',
  },
  subtitle: {
    marginTop: 8,
    color: '#14532d',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#dfe7df',
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  label: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#dfe7df',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 18,
    fontSize: 15,
    color: '#0f172a',
  },
  notice: {
    backgroundColor: '#ecfdf5',
    borderColor: '#86c9a8',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  noticeText: {
    color: '#14532d',
    fontSize: 13,
    lineHeight: 19,
  },
  noticeAction: {
    color: '#0b7c4e',
    fontWeight: '800',
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#0b7c4e',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  footerText: {
    color: '#475569',
  },
  linkText: {
    color: '#0b7c4e',
    fontWeight: '700',
  },
});
