import Navbar from "@/components/ui/Navbar";
import { StyleSheet, View } from "react-native";

export default function EditProfile() {
  return (
    <View style={[styles.container, styles.outer]}>
      <Navbar title="Edit Profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
  },
  outer: {
    padding: 10,
  },
  list: {
    paddingVertical: 10,
  },
});
