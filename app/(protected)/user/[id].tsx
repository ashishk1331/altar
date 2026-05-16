import { useMutation } from 'convex/react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import EmptyFeed from '@/components/home/EmptyFeed';
import Post from '@/components/Post';
import ProfileHeader from '@/components/profile/ProfileHeader';
import Button from '@/components/ui/Button';
import Flex from '@/components/ui/Flex';
import Navbar from '@/components/ui/Navbar';
import Separator from '@/components/ui/Separator';
import { Paragraph } from '@/components/ui/Text';

import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import useFetchPostsByUser from '@/hooks/useFetchPostsByUser';
import useFetchUser from '@/hooks/useFetchUser';
import { useSession } from '@/wrapper/SessionWrapper';

type QueryParams = { id: string };

export default function Profile() {
  const { user: viewer } = useSession();
  const { id } = useLocalSearchParams() as QueryParams;
  const authorId = id as Id<'users'>;

  const { posts, isPending, canLoadMore, loadMore } = useFetchPostsByUser(authorId, viewer?._id);
  const { user: author } = useFetchUser(authorId, viewer?._id);
  const follow = useMutation(api.followers.followAuthor);
  const unfollow = useMutation(api.followers.unfollowAuthor);

  if (isPending) {
    return <EmptyFeed message="loading profile" />;
  }

  const isAuthorTheUser = viewer?._id === authorId;

  function handleFollow() {
    if (!viewer || !author) return;
    if (author.isFollowing) {
      unfollow({ followee: authorId, follower: viewer._id });
    } else {
      follow({ followee: authorId, follower: viewer._id });
    }
  }

  return (
    <Flex direction="column" gap={0} p={10}>
      <Navbar title="" />
      <FlatList
        data={posts}
        renderItem={({ item: post }) => (
          <>
            <Post post={post} />
            <Separator />
          </>
        )}
        keyExtractor={(item) => item._id}
        style={styles.list}
        ListHeaderComponent={() => (
          <Flex direction="column" gap={0}>
            <View style={styles.profile}>
              <ProfileHeader isAtProfilePage id={authorId} />
            </View>
            <Flex w="100%" justify="space-between" items="center" p={10}>
              <Flex items="center" gap={6}>
                <Paragraph>Posts</Paragraph>
                <Paragraph bold>{author?.postCount ?? 0}</Paragraph>
              </Flex>
              {!isAuthorTheUser && author && (
                <Button onPress={handleFollow}>{author.isFollowing ? 'Unfollow' : 'Follow'}</Button>
              )}
            </Flex>
            <Separator />
          </Flex>
        )}
        ListFooterComponent={() =>
          canLoadMore ? (
            <View style={styles.bottomPadding}>
              <ActivityIndicator />
            </View>
          ) : (
            <View style={styles.bottomPadding} />
          )
        }
        onEndReached={() => canLoadMore && loadMore(12)}
        onEndReachedThreshold={0.5}
      />
    </Flex>
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: 10 },
  profile: { paddingHorizontal: 10 },
  bottomPadding: { paddingBottom: 64 },
});
