import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import AddPoemButton from '@/components/AddPoemButton';
import Post from '@/components/Post';
import EmptyFeed from '@/components/home/EmptyFeed';
import FeedTabs from '@/components/home/FeedTabs';
import Navbar from '@/components/home/Navbar';
import Button from '@/components/ui/Button';
import Flex from '@/components/ui/Flex';
import Separator from '@/components/ui/Separator';

import useFetchPosts from '@/hooks/useFetchPosts';
import { useSession } from '@/wrapper/SessionWrapper';

export default function Home() {
  const { user } = useSession();
  const { posts, isPending, canLoadMore, loadMore } = useFetchPosts(user?._id);
  const list: string[] = ['Recent', 'Following'];
  const [activeTab, setActiveTab] = React.useState(list[0]);

  return (
    <View style={[styles.container, styles.outer]}>
      <Navbar />
      <FeedTabs list={list} activeTab={activeTab} setActiveTab={setActiveTab} />
      {isPending ? (
        <ActivityIndicator />
      ) : posts.length < 1 ? (
        <EmptyFeed />
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item: post }) => (
            <>
              <Post post={post} />
              <Separator />
            </>
          )}
          ListFooterComponent={
            <View style={{ paddingBottom: 64 }}>
              {canLoadMore && (
                <Flex>
                  <Button onPress={() => loadMore(12)}>Load more</Button>
                </Flex>
              )}
            </View>
          }
          keyExtractor={(item) => item._id}
          style={styles.list}
          onEndReached={() => canLoadMore && loadMore(12)}
          onEndReachedThreshold={0.5}
        />
      )}
      <AddPoemButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
  },
  outer: {
    padding: 10,
  },
  list: {
    paddingVertical: 10,
  },
});
