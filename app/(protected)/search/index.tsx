import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import Navbar from '@/components/search/Navbar';
import Post from '@/components/Post';
import Separator from '@/components/ui/Separator';
import Flex from '@/components/ui/Flex';
import { Paragraph } from '@/components/ui/Text';

import { usePaginatedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function Search() {
  const [searchText, setSearchText] = React.useState('');
  const { results, status, loadMore } = usePaginatedQuery(
    api.poems.searchPoem,
    searchText.trim().length > 0 ? { searchText } : 'skip',
    { initialNumItems: 12 }
  );

  const isPending = status === 'LoadingFirstPage';
  const canLoadMore = status === 'CanLoadMore';

  return (
    <View style={[styles.container, styles.outer]}>
      <Navbar value={searchText} onChange={setSearchText} />
      <Flex w="100%" justify="space-between" items="center" p={10}>
        <Flex items="center" gap={6}>
          <Paragraph>Found</Paragraph>
          <Paragraph bold>{results.length}</Paragraph>
        </Flex>
      </Flex>
      {isPending && searchText.trim().length > 0 ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={results}
          renderItem={({ item: post }) => (
            <>
              <Post post={{ ...post, isBookmarked: false, isLiked: false }} />
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
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    marginBottom: 24,
  },
  outer: { padding: 10 },
  list: { paddingVertical: 10 },
});
