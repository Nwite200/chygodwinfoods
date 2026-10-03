import { StyleSheet, Text, View } from 'react-native';

export default function ConfirmationScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Order confirmed</Text>
      <Text style={styles.subtitle}>This route is intentionally left for the next milestone after the shared cart synchronization is validated.</Text>
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
    color: '#0b7c4e',
    fontSize: 30,
    fontWeight: '900',
  },
  subtitle: {
    color: '#475569',
    marginTop: 12,
    lineHeight: 22,
  },
});
