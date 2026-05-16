import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import Navbar from '@/components/ui/Navbar';
import Post from '@/components/Post';
import Separator from '@/components/ui/Separator';

import type { Id } from '@/convex/_generated/dataModel';
import useFetchDraftsByUser from '@/hooks/useFetchDraftsByUser';
import { useSession } from '@/wrapper/SessionWrapper';

export default function Drafts() {
  const { user } = useSession();
  if (!user) return null;
  return <DraftsList userId={user._id} />;
}

function DraftsList({ userId }: { userId: Id<'users'> }) {
  const { posts, isPending, canLoadMore, loadMore } = useFetchDraftsByUser(userId);

  return (
    <View style={[styles.container, styles.outer]}>
      <Navbar title="Drafts" />
      {isPending ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item: post }) => (
            <>
              <Post post={{ ...post, isBookmarked: false, isLiked: false }} isEditable />
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
