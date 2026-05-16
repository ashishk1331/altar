import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import type { Doc, Id } from '@/convex/_generated/dataModel';

export type CommentType = Doc<'comments'> & {
  author: Doc<'users'> | null;
};

export default function useFetchCommentsForPost(poemId: Id<'poems'>) {
  const comments = useQuery(api.comments.readCommentsOfPoem, { poemId });

  return {
    comments,
    isPending: comments === undefined,
  };
}
