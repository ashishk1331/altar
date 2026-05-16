import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ChatBubbleEmpty, HeartSolid } from 'iconoir-react-native';
import { router } from 'expo-router';
import { useMutation, usePaginatedQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';

import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Flex from '@/components/ui/Flex';
import Navbar from '@/components/ui/Navbar';
import Separator from '@/components/ui/Separator';
import { Caption, Footnote, Paragraph } from '@/components/ui/Text';

import { Colors } from '@/constants/Colors';
import { api } from '@/convex/_generated/api';
import { useSession } from '@/wrapper/SessionWrapper';

export default function Notifications() {
  const { user } = useSession();
  const { results, status, loadMore } = usePaginatedQuery(
    api.notifications.readNotifications,
    user ? { userId: user._id } : 'skip',
    { initialNumItems: 20 }
  );
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  const isPending = status === 'LoadingFirstPage';
  const canLoadMore = status === 'CanLoadMore';

  function handleOpen(item: (typeof results)[number]) {
    if (!item.read) markAsRead({ notificationId: item._id });
    if (item.poem) router.push(`/poem/${item.poem._id}`);
  }

  return (
    <View style={[styles.container, styles.outer]}>
      <Navbar
        title="Notifications"
        right={
          user && <Button onPress={() => markAllAsRead({ userId: user._id })}>Mark all read</Button>
        }
      />
      {isPending ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={results}
          renderItem={({ item }) => {
            const fromName = item.fromAuthor?.name || item.fromAuthor?.firstName || 'someone';
            return (
              <>
                <TouchableOpacity
                  onPress={() => handleOpen(item)}
                  style={[styles.row, !item.read && { backgroundColor: Colors.light.lightGray }]}
                >
                  <Flex items="center" gap={12}>
                    <Avatar
                      width={36}
                      name={fromName}
                      src={item.fromAuthor?.picture || undefined}
                    />
                    <Flex direction="column" gap={2}>
                      <Paragraph>
                        {fromName}{' '}
                        {item.type === 'like' ? 'liked your poem' : 'commented on your poem'}
                      </Paragraph>
                      {item.poem ? (
                        <Footnote color={Colors.light.grayed}>{item.poem.title}</Footnote>
                      ) : null}
                      <Caption color={Colors.light.grayed}>
                        {formatDistanceToNow(new Date(item.createdAt))}
                      </Caption>
                    </Flex>
                    {item.type === 'like' ? (
                      <HeartSolid color={Colors.light.active} width={20} height={20} />
                    ) : (
                      <ChatBubbleEmpty color={Colors.light.grayed} width={20} height={20} />
                    )}
                  </Flex>
                </TouchableOpacity>
                <Separator />
              </>
            );
          }}
          keyExtractor={(item) => item._id}
          onEndReached={() => canLoadMore && loadMore(20)}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <Flex p={24}>
              <Paragraph>no notifications yet</Paragraph>
            </Flex>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', flexDirection: 'column' },
  outer: { padding: 10 },
  row: { padding: 12 },
});
