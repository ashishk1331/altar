import Navbar from "@/components/ui/Navbar";
import Post from "@/components/Post";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import Separator from "@/components/ui/Separator";
import { useSession } from "@/wrapper/SessionWrapper";
import useFetchPostsByUser from "@/hooks/useFetchPostsByUser";
import useFetchBookmarks from "@/hooks/useFetchBookmarks";

export default function Posts() {
  const { session } = useSession();
  const userId = session?.user.id || "";
  const { data, isPending, isRefetching, refetch } =
    useFetchPostsByUser(userId);
  const { data: bookmarks } = useFetchBookmarks(userId);

  return (
    <View style={[styles.container, styles.outer]}>
      <Navbar title="Posts" />
      {!isPending && (
        <FlatList
          data={data?.data}
          renderItem={({ item: post }) => (
            <>
              <Post
                id={post.id}
                post={post}
                isEditable
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
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        />
      )}
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
});
