import Navbar from "@/components/ui/Navbar";
import Post from "@/components/Post";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import Separator from "@/components/ui/Separator";
import useFetchBookmarksWithPost from "@/hooks/useFetchBookmarksWithPost";
import { useSession } from "@/wrapper/SessionWrapper";

export default function Bookmarks() {
  const { session } = useSession();
  const userId = session?.user.id || "";
  const { data, isPending, isRefetching, refetch } =
    useFetchBookmarksWithPost(userId);

  return (
    <View style={[styles.container, styles.outer]}>
      <Navbar title="Bookmarks" />
      {!isPending && (
        <FlatList
          data={data?.data ?? []}
          renderItem={({ item: { posts: post } }) =>
            post && (
              <>
                <Post id={post.id} post={post} isBookmarked />
                <Separator />
              </>
            )
          }
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
