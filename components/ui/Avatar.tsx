import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, View } from "react-native";

type AvatarProps = {
  width: number;
  name: string;
};

export default function Avatar({ width, name }: AvatarProps) {
  const squareSize = {
    width,
    height: width,
    borderRadius: (36 / 120) * width,
  };
  const fontStyles = {
    fontSize: width / 1.8,
  };
  return (
    <View style={[styles.avatar, squareSize]}>
      <Text style={[styles.avatarText, fontStyles]}>
        {name && name.length > 1 ? name.charAt(0).toUpperCase() : "M"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: Colors.light.active,
  },
  avatarText: {
    color: Colors.light.background,
  },
});
