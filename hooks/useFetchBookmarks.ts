import { usePaginatedQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useSession } from '@/wrapper/SessionWrapper';

export default function useFetchBookmarks() {
  const { user } = useSession();
  const { results, status, loadMore } = usePaginatedQuery(
    api.bookmarks.readBookmarkedPoems,
    user ? {} : 'skip',
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
