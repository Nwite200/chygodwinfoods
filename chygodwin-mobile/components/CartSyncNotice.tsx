import { StyleSheet, Text, View } from 'react-native';

type CartSyncNoticeProps = {
  message: string | null;
};

export default function CartSyncNotice({ message }: CartSyncNoticeProps) {
  if (!message) {
    return null;
  }

  return (
    <View accessibilityRole="alert" style={styles.notice}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    backgroundColor: '#fff1f0',
    borderColor: '#e7a39b',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  message: {
    color: '#8f2d22',
    fontSize: 13,
    lineHeight: 18,
  },
});