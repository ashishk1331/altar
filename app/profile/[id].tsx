import Post from "@/components/post";
import ProfileHeader from "@/components/profile/ProfileHeader";
import Button from "@/components/ui/Button";
import Flex from "@/components/ui/Flex";
import Navbar from "@/components/ui/Navbar";
import Separator from "@/components/ui/Separator";
import { Paragraph } from "@/components/ui/Text";
import { StyleSheet, View, FlatList } from "react-native";

export default function Profile() {
  const data = Array(12)
    .fill("")
    .map((_, id) => ({ id: String(id) }));

  return (
    <Flex direction="column" gap={0} p={10}>
      <Navbar title="" />
      <FlatList
        data={data}
        renderItem={(data) => (
          <>
            <Post id={data.item.id} />
            <Separator />
          </>
        )}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListHeaderComponent={() => (
          <Flex direction="column" gap={0}>
            <View style={styles.profile}>
              <ProfileHeader />
            </View>
            <Flex w="100%" justify="space-between" items="center" p={10}>
              <Flex items="center" gap={6}>
                <Paragraph>Posts</Paragraph>
                <Paragraph bold>{data.length}</Paragraph>
              </Flex>
              <Button>Follow</Button>
            </Flex>
            <Separator />
          </Flex>
        )}
        ListFooterComponent={() => <View style={styles.bottomPadding} />}
      />
    </Flex>
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
  profile: {
    paddingHorizontal: 10,
  },
  bottomPadding: {
    paddingBottom: 64,
  },
});
