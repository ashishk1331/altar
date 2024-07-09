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
  right?: React.ReactNode;
};

export default function Navbar({ title, right }: NavbarProps) {
  function goBack() {
    router.back();
  }

  return (
    <View style={styles.navbar}>
      <Flex w="100%" justify="space-between" items="center">
        <Flex items="center" gap={24} justify="flex-start">
          <IconButton onPress={goBack}>
            <ArrowLeft color="black" height={24} width={24} />
          </IconButton>
          <Headline>{title}</Headline>
        </Flex>
        {right}
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    padding: 6,
  },
});
