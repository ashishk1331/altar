// Library
import React from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";

// Components
import Navbar from "@/components/search/Navbar";
import Tabs from "@/components/home/FeedTabs";
import Post from "@/components/Post";
import Separator from "@/components/ui/Separator";
import ProfileHeader from "@/components/profile/ProfileHeader";
import Flex from "@/components/ui/Flex";
// import Container from "@/components/ui/Container";
import { Paragraph } from "@/components/ui/Text";

// Constants
// import { Colors } from "@/constants/Colors";
import { jumpToProfile } from "@/util/jumpTo";

export default function AddPoem() {
  const list: string[] = ["Posts", "Users"];
  const [activeTab, setActiveTab] = React.useState(list[0]);
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

  function PostCard({ id }: { id: string }) {
    return (
      <>
        <Post id={id} />
        <Separator />
      </>
    );
  }

  // function EmptyCard() {
  //   return (
  //     <Container>
  //       <Paragraph color={Colors.light.grayed}>Nothing Found</Paragraph>
  //     </Container>
  //   );
  // }

  return (
    <View style={[styles.container, styles.outer]}>
      <Navbar />
      <Tabs list={list} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Flex w="100%" justify="space-between" items="center" p={10}>
        <Flex items="center" gap={6}>
          <Paragraph>Found</Paragraph>
          <Paragraph bold>{data.length}</Paragraph>
        </Flex>
      </Flex>
      <FlatList
        data={data}
        renderItem={({ item: { id } }) =>
          activeTab === list[0] ? <PostCard id={id} /> : <UserCard id={id} />
        }
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
    marginBottom: 24,
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
