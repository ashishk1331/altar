import { Colors } from '@/constants/Colors';
import { type PressableProps, StyleSheet, Text, TouchableOpacity } from 'react-native';

type ButtonProps = {
  children: React.ReactNode;
  fill?: boolean;
  onPress?: () => void;
} & PressableProps;

export default function Button({ children, fill, onPress }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          width: fill ? '100%' : 'auto',
        },
      ]}
    >
      {typeof children === 'string' ? (
        <Text style={styles.buttonText}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.text,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    lineHeight: 24,
  },
});
