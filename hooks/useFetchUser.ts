import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import type { Doc, Id } from '@/convex/_generated/dataModel';

export type AuthorType = Doc<'users'> & { isFollowing: boolean };

export default function useFetchUser(authorId: Id<'users'>, userId?: Id<'users'>) {
  const user = useQuery(api.users.readUser, { authorId, userId });

  return {
    user,
    isPending: user === undefined,
  };
}
