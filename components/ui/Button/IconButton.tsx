import { PressableProps, StyleSheet, TouchableOpacity } from "react-native";

type ButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
} & PressableProps;

export function IconButton({ children, onPress }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
});
