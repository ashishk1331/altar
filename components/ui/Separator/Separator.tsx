import { Colors } from "@/constants/Colors";
import { StyleSheet, View } from "react-native";

export default function Separator() {
  return <View style={styles.line} />;
}

const styles = StyleSheet.create({
  line: {
    width: "100%",
    height: 2,
    backgroundColor: Colors.light.lightGray,
    marginVertical: 10,
  },
});
