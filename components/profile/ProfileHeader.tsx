import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import Flex from '../ui/Flex';
import { Caption, Paragraph } from '../ui/Text';
import Avatar from '../ui/Avatar';

import type { Id } from '@/convex/_generated/dataModel';
import useFetchUser from '@/hooks/useFetchUser';
import { useSession } from '@/wrapper/SessionWrapper';

type ProfileHeaderProps = {
  isAtProfilePage?: boolean;
  id: Id<'users'>;
};

export default function ProfileHeader({ isAtProfilePage = false, id }: ProfileHeaderProps) {
  const { user: viewer } = useSession();
  const { user, isPending } = useFetchUser(id, viewer?._id);

  function jumpToFollowers(isFollowerList: boolean) {
    router.push(`/profile/user-list?userId=${id}&isFollowerList=${isFollowerList}`);
  }

  if (isPending || !user) {
    return null;
  }

  const name = user.name || user.firstName || 'anonymous';

  return (
    <View style={styles.container}>
      <Flex gap={16}>
        <Avatar width={120} name={name} src={user.picture || undefined} />
        <Flex direction="column" justify="space-between">
          <Paragraph>{name}</Paragraph>
          {user.bio ? <Caption>{user.bio}</Caption> : null}

          <View style={styles.bar}>
            <Flex justify="space-between" gap={24}>
              {isAtProfilePage ? (
                <TouchableOpacity onPress={() => jumpToFollowers(true)}>
                  <Caption>{user.followerCount} followers</Caption>
                </TouchableOpacity>
              ) : (
                <Caption>{user.followerCount} followers</Caption>
              )}

              {isAtProfilePage ? (
                <TouchableOpacity onPress={() => jumpToFollowers(false)}>
                  <Caption>{user.followingCount} following</Caption>
                </TouchableOpacity>
              ) : (
                <Caption>{user.followingCount} following</Caption>
              )}
            </Flex>
          </View>
        </Flex>
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  bar: {
    marginTop: 10,
  },
});
