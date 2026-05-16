import { useMutation } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import {
  Bookmark,
  BookmarkSolid,
  ChatBubbleEmpty,
  Heart,
  HeartSolid,
  MoreHoriz,
} from 'iconoir-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Icon } from '@/constants/Icon';
import { api } from '@/convex/_generated/api';
import useUpdateBookmark from '@/hooks/useUpdateBookmark';
import type { FeedPoem } from '@/types/poem';
import { jumpToPost, jumpToProfile } from '@/util/jumpTo';
import { useSession } from '@/wrapper/SessionWrapper';
import Avatar from '../ui/Avatar';
import { IconButton } from '../ui/Button';
import Flex from '../ui/Flex';
import { Caption, Footnote, LargeBody, Paragraph } from '../ui/Text';

type PostProps = {
  isEditable?: boolean;
  post: FeedPoem;
};

export default function Post({ isEditable = false, post }: PostProps) {
  const { user } = useSession();
  const toggleBookmark = useUpdateBookmark();
  const likePoem = useMutation(api.likes.likePoem);
  const dislikePoem = useMutation(api.likes.dislikePoem);

  const authorName = post.author?.name || post.author?.firstName || 'anonymous';
  const authorPicture = post.author?.picture || '';

  let body = post.body;
  if (body && body.length > 128) {
    body = `${body.substring(0, 125)}...`;
  }

  function handleBookmark() {
    if (!user) return;
    toggleBookmark({
      poemId: post._id,
      isBookmarked: post.isBookmarked,
    });
  }

  function handleLike() {
    if (!user || !post.author) return;
    const args = { poemId: post._id };
    if (post.isLiked) {
      dislikePoem(args);
    } else {
      likePoem(args);
    }
  }

  return (
    <View style={styles.container}>
      <Flex direction="column" gap={16} p={10} w="100%">
        <Flex gap={10} items="center" justify="space-between" w="100%">
          <TouchableOpacity onPress={() => jumpToProfile(post.authorId)}>
            <Flex gap={10} items="center">
              <Avatar width={28} name={authorName} src={authorPicture} />
              <Footnote>{authorName}</Footnote>
              <Footnote color={Colors.light.grayed}>
                {formatDistanceToNow(new Date(post._creationTime))}
              </Footnote>
            </Flex>
          </TouchableOpacity>
          {isEditable && (
            <IconButton>
              <MoreHoriz {...Icon} />
            </IconButton>
          )}
        </Flex>
        <TouchableOpacity style={styles.content} onPress={() => jumpToPost(post._id)}>
          <Flex w="100%" direction="column" gap={10}>
            <LargeBody>{post.title}</LargeBody>
            <Paragraph>{body}</Paragraph>
          </Flex>
        </TouchableOpacity>
        <Flex items="center" w="100%" justify="space-between">
          <Flex gap={24}>
            <Flex gap={0} items="center">
              <IconButton onPress={handleLike}>
                {post.isLiked ? (
                  <HeartSolid color={Colors.light.active} width={Icon.width} height={Icon.height} />
                ) : (
                  <Heart {...Icon} />
                )}
              </IconButton>
              {post.likeCount > 0 && <Caption>{post.likeCount}</Caption>}
            </Flex>
            <Flex gap={0} items="center">
              <IconButton onPress={() => jumpToPost(post._id)}>
                <ChatBubbleEmpty {...Icon} />
              </IconButton>
              {post.commentCount > 0 && <Caption>{post.commentCount}</Caption>}
            </Flex>
          </Flex>

          <IconButton onPress={handleBookmark}>
            {post.isBookmarked ? (
              <BookmarkSolid color={Colors.light.active} width={Icon.width} height={Icon.height} />
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
