// Library
import { View, StyleSheet } from "react-native";
import { ArrowLeft } from "iconoir-react-native";
import { router } from "expo-router";

// Components
import { IconButton } from "../Button";
import Flex from "../Flex";
import { Headline } from "../Text";

type NavbarProps = {
  title: string;
};

export default function Navbar({ title }: NavbarProps) {
  function goBack() {
    router.back();
  }

  return (
    <View style={styles.navbar}>
      <Flex items="center" w="100%" gap={24} justify="flex-start">
        <IconButton onPress={goBack}>
          <ArrowLeft color="black" height={24} width={24} />
        </IconButton>
        <Headline>{title}</Headline>
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    paddingHorizontal: 6,
    paddingVertical: 16,
  },
});
