import { usePaginatedQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

export default function useFetchBookmarks(userId: Id<'users'>) {
  const { results, status, loadMore } = usePaginatedQuery(
    api.bookmarks.readBookmarkedPoems,
    { userId },
    { initialNumItems: 12 }
  );

  return {
    posts: results,
    status,
    loadMore,
    isPending: status === 'LoadingFirstPage',
    canLoadMore: status === 'CanLoadMore',
  };
}
