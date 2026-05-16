import { v } from 'convex/values';
import { mutation } from './functions';
import { paginationOptsValidator } from 'convex/server';
import { query } from './_generated/server';

export const addBookmark = mutation({
  args: { authorId: v.id('users'), poemId: v.id('poems') },
  handler: async (ctx, args) =>
    await ctx.db.insert('bookmarks', {
      authorId: args.authorId,
      poemId: args.poemId,
    }),
});

export const removeBookmark = mutation({
  args: { authorId: v.id('users'), poemId: v.id('poems') },
  handler: async (ctx, args) => {
    const bookmark = await ctx.db
      .query('bookmarks')
      .filter((q) =>
        q.and(q.eq(q.field('poemId'), args.poemId), q.eq(q.field('authorId'), args.authorId))
      )
      .first();

    if (!bookmark) throw new Error('Bookmark not found.');

    await ctx.db.delete(bookmark._id);
  },
});

export const readBookmarkedPoems = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const paginatedBookmarks = await ctx.db
      .query('bookmarks')
      .withIndex('by_author', (q) => q.eq('authorId', args.userId))
      .order('desc')
      .paginate(args.paginationOpts);

    const allUserLikes = await ctx.db
      .query('likes')
      .withIndex('by_author', (q) => q.eq('authorId', args.userId))
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
