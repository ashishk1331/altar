// Library
import React from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

// Components
import Navbar from "@/components/home/Navbar";
import FeedTabs from "@/components/home/FeedTabs";
import Post from "@/components/Post";
import Separator from "@/components/ui/Separator";
import AddPoemButton from "@/components/AddPoemButton";
import EmptyFeed from "@/components/home/EmptyFeed";

// Constants
import useFetchPosts from "@/hooks/useFetchPosts";
import useFetchBookmarks from "@/hooks/useFetchBookmarks";
import { useSession } from "@/wrapper/SessionWrapper";
import Button from "@/components/ui/Button";
import Flex from "@/components/ui/Flex";

export default function Home() {
  const { session } = useSession();
  const userId = session?.user.id || "";
  const { data, isPending, isRefetching, refetch } = useFetchPosts();
  const { data: bookmarks } = useFetchBookmarks(userId);
  const list: string[] = ["Recent", "Following"];
  const [activeTab, setActiveTab] = React.useState(list[0]);

  return (
    <View style={[styles.container, styles.outer]}>
      <Navbar userId={userId} />
      <FeedTabs list={list} activeTab={activeTab} setActiveTab={setActiveTab} />
      {isPending || (data?.data?.length ?? 0) < 1 ? (
        <EmptyFeed />
      ) : (
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
          ListFooterComponent={
            <View style={{ paddingBottom: 64 }}>
              <Flex>
                <Button>Load more</Button>
              </Flex>
            </View>
          }
          keyExtractor={(item) => item.id}
          style={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        />
      )}
      <AddPoemButton />
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
