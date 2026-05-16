import { ConvexError, v } from 'convex/values';
import { mutation } from './functions';
import { paginationOptsValidator } from 'convex/server';
import { query } from './_generated/server';
import { getCurrentUserOrThrow } from './authHelpers';

export const addBookmark = mutation({
  args: { poemId: v.id('poems') },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const existing = await ctx.db
      .query('bookmarks')
      .withIndex('by_author_poem', (q) => q.eq('authorId', user._id).eq('poemId', args.poemId))
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert('bookmarks', {
      authorId: user._id,
      poemId: args.poemId,
    });
  },
});

export const removeBookmark = mutation({
  args: { poemId: v.id('poems') },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const bookmark = await ctx.db
      .query('bookmarks')
      .withIndex('by_author_poem', (q) => q.eq('authorId', user._id).eq('poemId', args.poemId))
      .first();

    if (!bookmark) throw new ConvexError({ message: 'Bookmark not found.', code: 404 });

    await ctx.db.delete(bookmark._id);
  },
});

export const readBookmarkedPoems = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const paginatedBookmarks = await ctx.db
      .query('bookmarks')
      .withIndex('by_author', (q) => q.eq('authorId', user._id))
      .order('desc')
      .paginate(args.paginationOpts);

    const allUserLikes = await ctx.db
      .query('likes')
      .withIndex('by_author', (q) => q.eq('authorId', user._id))
      .collect();

    const userLikes = new Set(allUserLikes.map((l) => l.poemId));

    const poemsWithAuthors = await Promise.all(
      paginatedBookmarks.page.map(async (bookmark) => {
        const poem = await ctx.db.get(bookmark.poemId);
        if (!poem) return null;

        const author = await ctx.db.get(poem.authorId);
        const isLiked = userLikes.has(poem._id);

        return {
          ...poem,
          author,
          isBookmarked: true,
          isLiked,
        };
      })
    );

    const validPoems = poemsWithAuthors.filter((poem) => poem !== null);

    return {
      ...paginatedBookmarks,
      page: validPoems,
    };
  },
});
