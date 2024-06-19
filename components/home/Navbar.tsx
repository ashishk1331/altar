import { View, StyleSheet, TouchableOpacity } from "react-native";
import Flex from "../ui/Flex";
import { Headline } from "../ui/Text";
import { IconButton } from "../ui/Button";
import { Search } from "iconoir-react-native";
import ImageContainer from "../ui/ImageContainer";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function Navbar() {
  function goToProfile() {
    router.push("/profile");
  }
  return (
    <View style={styles.navbar}>
      <Flex items="center" justify="space-between" w="100%">
        <TouchableOpacity onPress={goToProfile}>
          <ImageContainer width={42} />
        </TouchableOpacity>
        <Headline>Altar</Headline>
        <IconButton onPress={() => {}}>
          <Search color={Colors.light.text} height={24} width={24} />
        </IconButton>
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    padding: 12,
    paddingVertical: 16,
  },
});
