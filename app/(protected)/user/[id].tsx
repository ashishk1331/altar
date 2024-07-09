// Library
import { StyleSheet, View, FlatList, RefreshControl } from "react-native";

// Components
import Post from "@/components/Post";
import ProfileHeader from "@/components/profile/ProfileHeader";
import Button from "@/components/ui/Button";
import Flex from "@/components/ui/Flex";
import Navbar from "@/components/ui/Navbar";
import Separator from "@/components/ui/Separator";
import { Paragraph } from "@/components/ui/Text";
import { useLocalSearchParams } from "expo-router";
import useFetchPostsByUser from "@/hooks/useFetchPostsByUser";
import EmptyFeed from "@/components/home/EmptyFeed";
import { useSession } from "@/wrapper/SessionWrapper";
import useFetchBookmarks from "@/hooks/useFetchBookmarks";

export default function Profile() {
  const { session } = useSession();
  const userId = session?.user.id ?? "";

  const { id } = useLocalSearchParams();
  const { data, isPending, isRefetching, refetch } = useFetchPostsByUser(id);
  const { data: bookmarks } = useFetchBookmarks(id);

  if (isPending || isRefetching) {
    return <EmptyFeed message="loading profile" />;
  }

  const isAuthorTheUser = userId === id;

  return (
    <Flex direction="column" gap={0} p={10}>
      <Navbar title="" />
      <FlatList
        data={data?.data || []}
        renderItem={({ item: post }) => (
          <>
            <Post
              id={post.id}
              post={post}
              isBookmarked={
                bookmarks?.data?.find(
                  (bookmark) => bookmark.post_id === post.id,
                ) !== undefined
              }
            />
            <Separator />
          </>
        )}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListHeaderComponent={() => (
          <Flex direction="column" gap={0}>
            <View style={styles.profile}>
              <ProfileHeader isAtProfilePage id={id ?? ""} />
            </View>
            <Flex w="100%" justify="space-between" items="center" p={10}>
              <Flex items="center" gap={6}>
                <Paragraph>Posts</Paragraph>
                <Paragraph bold>{data?.data?.length || 0}</Paragraph>
              </Flex>
              {!isAuthorTheUser && <Button>Follow</Button>}
            </Flex>
            <Separator />
          </Flex>
        )}
        ListFooterComponent={() => <View style={styles.bottomPadding} />}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
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
