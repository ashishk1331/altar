// Library
import {
  Bookmark,
  BookmarkSolid,
  ChatBubbleEmpty,
  Heart,
  MoreHoriz,
} from "iconoir-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { formatDistanceToNow } from "date-fns";

// Components
import Flex from "../ui/Flex";
import { Caption, Footnote, LargeBody, Paragraph } from "../ui/Text";
import { IconButton } from "../ui/Button";
import Avatar from "../ui/Avatar";

// Constants
import { Colors } from "@/constants/Colors";
import { Icon } from "@/constants/Icon";
import { jumpToProfile, jumpToPost } from "@/util/jumpTo";
import { PostType } from "@/hooks/useFetchPosts";
import useUpdateBookmark from "@/hooks/useUpdateBookmark";
import { useSession } from "@/wrapper/SessionWrapper";

type PostProps = {
  id: string;
  isEditable?: boolean;
  isBookmarked?: boolean;
  post: PostType;
};

export default function Post({
  id,
  isEditable = false,
  isBookmarked = false,
  post,
}: PostProps) {
  const { session } = useSession();
  const author_id = session?.user.id ?? "";
  const { mutate, isPending: isMutating } = useUpdateBookmark(author_id);
  let content = post.content;
  if (content && content.length > 128) {
    content = content.substring(0, 125) + "...";
  }

  function handleBookmark() {
    if (id && typeof id === "string" && !isMutating) {
      mutate({ author_id, post_id: post.id });
    }
  }

  return (
    <View style={styles.container}>
      <Flex direction="column" gap={16} p={10} w="100%">
        <Flex gap={10} items="center" justify="space-between" w="100%">
          <TouchableOpacity onPress={() => jumpToProfile(post.author_id ?? "")}>
            <Flex gap={10} items="center">
              <Avatar width={28} name={post.authors.name ?? ""} />
              <Footnote>{post.authors.name || "Maya"}</Footnote>
              <Footnote color={Colors.light.grayed}>
                {formatDistanceToNow(new Date(post.created_at))}
              </Footnote>
            </Flex>
          </TouchableOpacity>
          {isEditable && (
            <IconButton>
              <MoreHoriz {...Icon} />
            </IconButton>
          )}
        </Flex>
        <TouchableOpacity style={styles.content} onPress={() => jumpToPost(id)}>
          <Flex w="100%" direction="column" gap={10}>
            <LargeBody>{post.title}</LargeBody>
            <Paragraph>{content}</Paragraph>
          </Flex>
        </TouchableOpacity>
        <Flex items="center" w="100%" justify="space-between">
          <Flex gap={24}>
            <Flex gap={0} items="center">
              <IconButton>
                <Heart {...Icon} />
              </IconButton>
              {post.like_count !== null && post.like_count > 0 && (
                <Caption>{post.like_count}</Caption>
              )}
            </Flex>
            <Flex gap={0} items="center">
              <IconButton>
                <ChatBubbleEmpty {...Icon} />
              </IconButton>
              {post.comment_count !== null && post.comment_count > 0 && (
                <Caption>{post.comment_count}</Caption>
              )}
            </Flex>
          </Flex>

          <IconButton onPress={handleBookmark}>
            {isBookmarked ? (
              <BookmarkSolid
                color={Colors.light.active}
                width={Icon.width}
                height={Icon.height}
              />
            ) : (
              <Bookmark {...Icon} />
            )}
          </IconButton>
        </Flex>
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  content: {
    marginVertical: 10,
  },
});
