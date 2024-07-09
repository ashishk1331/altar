// Library
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Bookmark, ChatBubbleEmpty, Heart } from "iconoir-react-native";

// Components
import Navbar from "@/components/ui/Navbar";
import Separator from "@/components/ui/Separator";
import { IconButton } from "@/components/ui/Button";
import Flex from "@/components/ui/Flex";
import Comment from "@/components/Comment";
import { Caption, Footnote, LargeBody, Paragraph } from "@/components/ui/Text";
import Avatar from "@/components/ui/Avatar";
import CommentBox from "@/components/Comment/CommentBox";

// Constants
import { Icon } from "@/constants/Icon";
import { Colors } from "@/constants/Colors";
import { jumpToProfile } from "@/util/jumpTo";
import useFetchPosts from "@/hooks/useFetchPosts";
import { useLocalSearchParams } from "expo-router";
import { formatDistanceToNow } from "date-fns";
import useFetchCommentsForPost from "@/hooks/useFetchCommentsForPost";
import { useSession } from "@/wrapper/SessionWrapper";
import useUpdateBookmark from "@/hooks/useUpdateBookmark";
import React from "react";
import useFetchBookmarks from "@/hooks/useFetchBookmarks";

export default function Poem() {
  const { session } = useSession();
  const author_id = session?.user.id ?? "";
  const { data, isPending, isRefetching, refetch } = useFetchPosts();
  const { data: bookmarks, isPending: isFetchingBoomarks } =
    useFetchBookmarks(author_id);
  const { id } = useLocalSearchParams();
  const { mutate, isPending: isMutating } = useUpdateBookmark(author_id);

  function handleBookmark() {
    if (id && typeof id === "string" && !isMutating) {
      mutate({ author_id, post_id: id });
    }
  }

  if (isPending && !data) {
    return <ActivityIndicator />;
  }

  const currentPost = data?.data?.find((post) => post.id === id);
  const isBookmarked =
    bookmarks?.data?.find((bookmark) => bookmark.post_id === id) !== undefined;

  return (
    <>
      <ScrollView
        style={[styles.container, styles.outer]}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <Navbar title="" />
        <Flex w="100%" direction="column" gap={10} p={10}>
          <LargeBody>{currentPost?.title}</LargeBody>
          <Paragraph>{currentPost?.content}</Paragraph>
        </Flex>
        <Separator />
        <TouchableOpacity
          onPress={() => jumpToProfile(currentPost?.author_id || "")}
        >
          <Flex gap={10} items="center" justify="flex-start" w="100%" p={10}>
            <Avatar width={28} name={currentPost?.authors?.name || "Maya"} />
            <Footnote>{currentPost?.authors?.name || "Maya"}</Footnote>
            <Footnote color={Colors.light.grayed}>
              {formatDistanceToNow(new Date(currentPost?.created_at || ""))}
            </Footnote>
          </Flex>
        </TouchableOpacity>
        <Flex items="center" w="100%" justify="space-between" p={10}>
          <Flex gap={24}>
            <Flex gap={0} items="center">
              <IconButton>
                <Heart {...Icon} />
              </IconButton>
              {currentPost && (currentPost.like_count ?? 0) > 0 && (
                <Caption>{currentPost.like_count}</Caption>
              )}
            </Flex>
            <Flex gap={0} items="center">
              <IconButton>
                <ChatBubbleEmpty {...Icon} />
              </IconButton>
              {currentPost && (currentPost.comment_count ?? 0) > 0 && (
                <Caption>{currentPost.comment_count}</Caption>
              )}
            </Flex>
          </Flex>

          <IconButton onPress={handleBookmark}>
            <Bookmark
              fill={isBookmarked ? Colors.light.active : "transparent"}
              color={isBookmarked ? "transparent" : Colors.light.grayed}
              width={Icon.width}
              height={Icon.height}
            />
          </IconButton>
        </Flex>
        <Separator />
        <CommentsContainer post_id={id as string} />
      </ScrollView>
      <CommentBox postId={id} />
    </>
  );
}

function CommentsContainer({ post_id }: { post_id: string }) {
  const { data, isPending } = useFetchCommentsForPost(post_id);

  if (isPending) {
    return null;
  }

  return (
    <View style={styles.bottomPadding}>
      <Flex direction="column" w="100%">
        {data?.data?.map((comment, index) => (
          <Comment key={index} comment={comment} />
        ))}
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    gap: 10,
  },
  outer: {
    padding: 10,
  },
  list: {
    paddingVertical: 10,
  },
  bottomPadding: {
    paddingBottom: 64,
  },
});
