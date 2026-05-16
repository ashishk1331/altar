import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import Navbar from '@/components/ui/Navbar';
import Post from '@/components/Post';
import Separator from '@/components/ui/Separator';

import useFetchBookmarks from '@/hooks/useFetchBookmarks';
import { useSession } from '@/wrapper/SessionWrapper';

export default function Bookmarks() {
  const { user } = useSession();
  if (!user) return null;
  return <BookmarksList />;
}

function BookmarksList() {
  const { posts, isPending, canLoadMore, loadMore } = useFetchBookmarks();

  return (
    <View style={[styles.container, styles.outer]}>
      <Navbar title="Bookmarks" />
      {isPending ? (
        <ActivityIndicator />
      ) : (
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
          onEndReached={() => canLoadMore && loadMore(12)}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', flexDirection: 'column' },
  outer: { padding: 10 },
  list: { paddingVertical: 10 },
});
