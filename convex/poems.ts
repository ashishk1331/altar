import { ConvexError, v } from 'convex/values';
import { query } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';
import { mutation } from './functions';
import { getCurrentUserOrThrow } from './authHelpers';

export const readAPoem = query({
  args: { poemId: v.id('poems'), userId: v.optional(v.id('users')) },
  handler: async (ctx, args) => {
    const poem = await ctx.db.get(args.poemId);

    if (!poem) {
      return null;
    }

    const author = await ctx.db.get(poem.authorId);
    if (!author) {
      return null;
    }

    let isBookmarked = false;
    let isLiked = false;

    if (args.userId) {
      const [bookmark, like] = await Promise.all([
        ctx.db
          .query('bookmarks')
          .withIndex('by_author_poem', (q) => q.eq('authorId', args.userId!).eq('poemId', poem._id))
          .first(),
        ctx.db
          .query('likes')
          .withIndex('by_author_poem', (q) => q.eq('authorId', args.userId!).eq('poemId', poem._id))
          .first(),
      ]);

      isBookmarked = !!bookmark;
      isLiked = !!like;
    }

    return { ...poem, author, isBookmarked, isLiked };
  },
});

export const readPoems = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    const paginatedPoems = await ctx.db
      .query('poems')
      .filter((q) => q.eq(q.field('isDraft'), false))
      .order('desc')
      .paginate(args.paginationOpts);

    let userBookmarks = new Set();
    let userLikes = new Set();

    if (args.userId) {
      const [bookmarks, likes] = await Promise.all([
        ctx.db
          .query('bookmarks')
          .withIndex('by_author', (q) => q.eq('authorId', args.userId!))
          .collect(),
        ctx.db
          .query('likes')
          .withIndex('by_author', (q) => q.eq('authorId', args.userId!))
          .collect(),
      ]);

      userBookmarks = new Set(bookmarks.map((b) => b.poemId));
      userLikes = new Set(likes.map((l) => l.poemId));
    }

    const poemsWithAuthors = await Promise.all(
      paginatedPoems.page.map(async (poem) => {
        const author = await ctx.db.get(poem.authorId);

        const isBookmarked = userBookmarks.has(poem._id);
        const isLiked = userLikes.has(poem._id);

        return {
          ...poem,
          author,
          isBookmarked,
          isLiked,
        };
      })
    );

    return {
      ...paginatedPoems,
      page: poemsWithAuthors,
    };
  },
});

export const readPoemsByAuthor = query({
  args: {
    paginationOpts: paginationOptsValidator,
    authorId: v.id('users'),
    userId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    const paginatedPoems = await ctx.db
      .query('poems')
      .withIndex('by_author', (q) => q.eq('authorId', args.authorId))
      .filter((q) => q.eq(q.field('isDraft'), false))
      .order('desc')
      .paginate(args.paginationOpts);

    let userBookmarks = new Set();
    let userLikes = new Set();

    if (args.userId) {
      const [bookmarks, likes] = await Promise.all([
        ctx.db
          .query('bookmarks')
          .withIndex('by_author', (q) => q.eq('authorId', args.userId!))
          .collect(),
        ctx.db
          .query('likes')
          .withIndex('by_author', (q) => q.eq('authorId', args.userId!))
          .collect(),
      ]);

      userBookmarks = new Set(bookmarks.map((b) => b.poemId));
      userLikes = new Set(likes.map((l) => l.poemId));
    }

    const poemsWithAuthors = await Promise.all(
      paginatedPoems.page.map(async (poem) => {
        const author = await ctx.db.get(poem.authorId);

        const isBookmarked = userBookmarks.has(poem._id);
        const isLiked = userLikes.has(poem._id);

        return {
          ...poem,
          author,
          isBookmarked,
          isLiked,
        };
      })
    );

    return {
      ...paginatedPoems,
      page: poemsWithAuthors,
    };
  },
});

export const readDraftPoems = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const paginatedPoems = await ctx.db
      .query('poems')
      .withIndex('by_author_and_is_draft', (q) => q.eq('authorId', user._id).eq('isDraft', true))
      .order('desc')
      .paginate(args.paginationOpts);

    const poemsWithAuthors = await Promise.all(
      paginatedPoems.page.map(async (poem) => {
        const author = await ctx.db.get(poem.authorId);
        return {
          ...poem,
          author,
        };
      })
    );

    return {
      ...paginatedPoems,
      page: poemsWithAuthors,
    };
  },
});

export const writePoem = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    isDraft: v.boolean(),
    poemId: v.optional(v.id('poems')),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (args.poemId) {
      const existing = await ctx.db.get(args.poemId);
      if (!existing) throw new ConvexError({ message: 'Poem not found.', code: 404 });
      if (existing.authorId !== user._id) {
        throw new ConvexError({ message: 'Not allowed to edit this poem.', code: 403 });
      }
      await ctx.db.patch(args.poemId, {
        title: args.title,
        body: args.body,
        isDraft: args.isDraft,
      });
      return 'Document updated';
    }
    return await ctx.db.insert('poems', {
      title: args.title,
      body: args.body,
      authorId: user._id,
      likeCount: 0,
      commentCount: 0,
      isDraft: args.isDraft,
    });
  },
});

export const deletePoem = mutation({
  args: { poemId: v.id('poems') },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const poem = await ctx.db.get(args.poemId);
    if (!poem) throw new ConvexError({ message: 'Poem not found.', code: 404 });
    if (poem.authorId !== user._id) {
      throw new ConvexError({ message: 'Not allowed to delete this poem.', code: 403 });
    }
    await ctx.db.delete(args.poemId);
  },
});

export const searchPoem = query({
  args: { paginationOpts: paginationOptsValidator, searchText: v.string() },
  handler: async (ctx, args) => {
    const paginatedPoems = await ctx.db
      .query('poems')
      .withSearchIndex('search_title', (q) => q.search('title', args.searchText))
      .filter((q) => q.and(q.eq(q.field('isDraft'), false)))
      .paginate(args.paginationOpts);

    const poemsWithAuthors = await Promise.all(
      paginatedPoems.page.map(async (poem) => {
        const author = await ctx.db.get(poem.authorId);
        return {
          ...poem,
          author,
        };
      })
    );

    return {
      ...paginatedPoems,
      page: poemsWithAuthors,
    };
  },
});
