import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORIES, getImageUri } from '../lib/products';

type CategoryChipProps = {
  item: (typeof CATEGORIES)[number];
  onPress?: (categoryId: string) => void;
};

export default function CategoryChip({ item, onPress }: CategoryChipProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress?.(item.id)}
      android_ripple={{ color: '#d1fae5' }}
    >
      <Image source={{ uri: getImageUri(item.image) }} style={styles.image} />
      <View style={styles.meta}>
        <Text style={styles.icon}>{item.icon}</Text>
        <Text style={styles.label}>{item.name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  image: {
    width: '100%',
    height: 86,
    backgroundColor: '#ecfdf5',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
  },
});
