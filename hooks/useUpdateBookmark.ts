import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

export default function useUpdateBookmark() {
  const add = useMutation(api.bookmarks.addBookmark);
  const remove = useMutation(api.bookmarks.removeBookmark);

  return async function toggle({
    authorId,
    poemId,
    isBookmarked,
  }: {
    authorId: Id<'users'>;
    poemId: Id<'poems'>;
    isBookmarked: boolean;
  }) {
    if (isBookmarked) {
      await remove({ authorId, poemId });
    } else {
      await add({ authorId, poemId });
    }
  };
}
