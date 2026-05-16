import { usePaginatedQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useSession } from '@/wrapper/SessionWrapper';

export default function useFetchDraftsByUser() {
  const { user } = useSession();
  const { results, status, loadMore } = usePaginatedQuery(
    api.poems.readDraftPoems,
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
