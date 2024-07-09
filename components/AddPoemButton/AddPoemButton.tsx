import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { Plus } from "iconoir-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function AddPoemButton() {
  function goToEditor() {
    router.push("/editor");
  }
  return (
    <TouchableOpacity
      onPress={goToEditor}
      style={[styles.container, { backgroundColor: Colors.light.text }]}
    >
      <Plus color={Colors.light.background} width={24} height={24} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 16,
    borderRadius: 120,
  },
});
