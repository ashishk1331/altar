import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

export default function useFetchPostById(poemId: Id<'poems'>, userId?: Id<'users'>) {
  const post = useQuery(api.poems.readAPoem, { poemId, userId });

  return {
    post,
    isPending: post === undefined,
  };
}
