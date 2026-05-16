import type { Doc } from '@/convex/_generated/dataModel';

export type FeedPoem = Doc<'poems'> & {
  author: Doc<'users'> | null;
  isBookmarked: boolean;
  isLiked: boolean;
};
