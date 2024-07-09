// Library
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Search } from "iconoir-react-native";

// Components
import Flex from "../ui/Flex";
import { Headline } from "../ui/Text";
import { IconButton } from "../ui/Button";
import Avatar from "../ui/Avatar";

// Constants
import { Colors } from "@/constants/Colors";
import useFetchUser from "@/hooks/useFetchUser";

type NavbarProps = {
  userId: string;
};

export default function Navbar({ userId }: NavbarProps) {
  const { data, isPending } = useFetchUser(userId);
  function goToProfile() {
    router.push("/profile");
  }
  function goToSearch() {
    router.push("/search");
  }

  return (
    <View style={styles.navbar}>
      <Flex items="center" justify="space-between" w="100%">
        <TouchableOpacity onPress={goToProfile}>
          {!isPending && <Avatar width={42} name={data?.data?.name || ""} />}
        </TouchableOpacity>
        <Headline>Altar</Headline>
        <IconButton>
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
