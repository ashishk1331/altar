// Library
import { View, StyleSheet, TextInput } from "react-native";
import { ArrowLeft, Search } from "iconoir-react-native";
import { router } from "expo-router";

// Components
import Flex from "../ui/Flex";
import { IconButton } from "../ui/Button";

export default function Navbar() {
  function goBack() {
    router.back();
  }

  return (
    <View style={styles.navbar}>
      <Flex w="100%" justify="space-between" items="center">
        <IconButton onPress={goBack}>
          <ArrowLeft color="black" height={24} width={24} />
        </IconButton>

        <TextInput style={styles.textInput} placeholder="search something" />

        <IconButton onPress={() => {}}>
          <Search color="black" height={24} width={24} />
        </IconButton>
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    paddingHorizontal: 6,
    paddingVertical: 16,
  },
  textInput: {
    flex: 1,
    padding: 6,
    fontSize: 17,
    lineHeight: 24,
  },
});
