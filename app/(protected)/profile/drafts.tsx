import Navbar from "@/components/ui/Navbar";
import Post from "@/components/Post";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import Separator from "@/components/ui/Separator";
import useFetchDraftsByUser from "@/hooks/useFetchDraftsByUser";
import { useSession } from "@/wrapper/SessionWrapper";

export default function Drafts() {
  const { session } = useSession();
  const userId = session?.user.id || "";
  const { data, isPending, isRefetching, refetch } =
    useFetchDraftsByUser(userId);

  return (
    <View style={[styles.container, styles.outer]}>
      <Navbar title="Drafts" />
      {!isPending && (
        <FlatList
          data={data?.data}
          renderItem={({ item: post }) => (
            <>
              <Post id={post.id} post={post} isEditable />
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
