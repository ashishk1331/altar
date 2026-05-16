import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Bookmark, BookmarkSolid, ChatBubbleEmpty, Heart, HeartSolid } from 'iconoir-react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMutation } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';

import Navbar from '@/components/ui/Navbar';
import Separator from '@/components/ui/Separator';
import { IconButton } from '@/components/ui/Button';
import Flex from '@/components/ui/Flex';
import Comment from '@/components/Comment';
import { Caption, Footnote, LargeBody, Paragraph } from '@/components/ui/Text';
import Avatar from '@/components/ui/Avatar';
import CommentBox from '@/components/Comment/CommentBox';

import { Icon } from '@/constants/Icon';
import { Colors } from '@/constants/Colors';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { jumpToProfile } from '@/util/jumpTo';
import useFetchCommentsForPost from '@/hooks/useFetchCommentsForPost';
import { useSession } from '@/wrapper/SessionWrapper';
import useUpdateBookmark from '@/hooks/useUpdateBookmark';
import useFetchPostById from '@/hooks/usefetchPostById';

type QueryParams = {
  id: string;
};

export default function Poem() {
  const { id } = useLocalSearchParams() as QueryParams;
  const poemId = id as Id<'poems'>;

  const { user } = useSession();
  const { post, isPending } = useFetchPostById(poemId, user?._id);

  const toggleBookmark = useUpdateBookmark();
  const likePoem = useMutation(api.likes.likePoem);
  const dislikePoem = useMutation(api.likes.dislikePoem);

  if (isPending || !post) {
    return <ActivityIndicator />;
  }

  const authorName = post.author?.name || post.author?.firstName || 'anonymous';
  const authorPicture = post.author?.picture || '';

  function handleBookmark() {
    if (!user || !post) return;
    toggleBookmark({
      authorId: user._id,
      poemId: post._id,
      isBookmarked: post.isBookmarked,
    });
  }

  function handleLike() {
    if (!user || !post?.author) return;
    const args = {
      authorId: user._id,
      poemId: post._id,
      poemAuthorId: post.author._id,
    };
    if (post.isLiked) {
      dislikePoem(args);
    } else {
      likePoem(args);
    }
  }

  return (
    <>
      <ScrollView style={[styles.container, styles.outer]}>
        <Navbar title="" />
        <Flex w="100%" direction="column" gap={10} p={10}>
          <LargeBody>{post.title}</LargeBody>
          <Paragraph>{post.body}</Paragraph>
        </Flex>
        <Separator />
        <TouchableOpacity onPress={() => jumpToProfile(post.authorId)}>
          <Flex gap={10} items="center" justify="flex-start" w="100%" p={10}>
            <Avatar width={28} name={authorName} src={authorPicture} />
            <Footnote>{authorName}</Footnote>
            <Footnote color={Colors.light.grayed}>
              {formatDistanceToNow(new Date(post._creationTime))}
            </Footnote>
          </Flex>
        </TouchableOpacity>
        <Flex items="center" w="100%" justify="space-between" p={10}>
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
              <IconButton>
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
        <Separator />
        <CommentsContainer poemId={poemId} />
      </ScrollView>
      <CommentBox poemId={poemId} poemAuthorId={post.author?._id ?? null} />
    </>
  );
}

function CommentsContainer({ poemId }: { poemId: Id<'poems'> }) {
  const { comments, isPending } = useFetchCommentsForPost(poemId);

  if (isPending || !comments) {
    return null;
  }

  return (
    <View style={styles.bottomPadding}>
      <Flex direction="column" w="100%">
        {comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    gap: 10,
  },
  outer: {
    padding: 10,
  },
  bottomPadding: {
    paddingBottom: 64,
  },
});
