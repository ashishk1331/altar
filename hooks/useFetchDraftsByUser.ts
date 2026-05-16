import { usePaginatedQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

export default function useFetchDraftsByUser(userId: Id<'users'>) {
  const { results, status, loadMore } = usePaginatedQuery(
    api.poems.readDraftPoems,
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
