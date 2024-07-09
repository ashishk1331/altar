// Library
import { useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

// Components
import ProfileHeader from "@/components/profile/ProfileHeader";
import Flex from "@/components/ui/Flex";
import Navbar from "@/components/ui/Navbar";
import Separator from "@/components/ui/Separator";

// Constants
import { jumpToProfile } from "@/util/jumpTo";

export default function Posts() {
  const { isFollowerList } = useLocalSearchParams();
  const data = Array(12)
    .fill("")
    .map((_, id) => ({ id: String(id) }));

  function UserCard({ id }: { id: string }) {
    return (
      <View style={styles.listHori}>
        <Flex direction="column">
          <TouchableOpacity onPress={() => jumpToProfile(id)}>
            <ProfileHeader />
          </TouchableOpacity>
          <Separator />
        </Flex>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.outer]}>
      <Navbar title={isFollowerList ? "Followers" : "Following"} />
      <FlatList
        data={data}
        renderItem={({ item: { id } }) => <UserCard id={id} />}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
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

  listHori: {
    paddingHorizontal: 6,
  },
});
