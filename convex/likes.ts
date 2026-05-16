import { ConvexError, v } from 'convex/values';
import { mutation } from './functions';
import { getCurrentUserOrThrow } from './authHelpers';

export const likePoem = mutation({
  args: { poemId: v.id('poems') },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const poem = await ctx.db.get(args.poemId);
    if (!poem) throw new ConvexError({ message: 'Poem not found.', code: 404 });

    const existing = await ctx.db
      .query('likes')
      .withIndex('by_author_poem', (q) => q.eq('authorId', user._id).eq('poemId', args.poemId))
      .first();
    if (existing) return existing._id;

    const likeRecord = await ctx.db.insert('likes', {
      authorId: user._id,
      poemId: args.poemId,
    });

    if (poem.authorId !== user._id) {
      await ctx.db.insert('notifications', {
        authorId: poem.authorId,
        type: 'like',
        poemId: args.poemId,
        fromAuthorId: user._id,
        createdAt: Date.now(),
        read: false,
      });
    }

    return likeRecord;
  },
});

export const dislikePoem = mutation({
  args: { poemId: v.id('poems') },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const poem = await ctx.db.get(args.poemId);
    if (!poem) throw new ConvexError({ message: 'Poem not found.', code: 404 });

    const likeRecord = await ctx.db
      .query('likes')
      .withIndex('by_author_poem', (q) => q.eq('authorId', user._id).eq('poemId', args.poemId))
      .first();

    if (!likeRecord) throw new ConvexError({ message: 'Like not found.', code: 404 });

    if (poem.authorId !== user._id) {
      const notificationRecord = await ctx.db
        .query('notifications')
        .filter((q) =>
          q.and(
            q.eq(q.field('authorId'), poem.authorId),
            q.eq(q.field('poemId'), args.poemId),
            q.eq(q.field('fromAuthorId'), user._id)
          )
        )
        .first();
      if (notificationRecord) await ctx.db.delete(notificationRecord._id);
    }

    await ctx.db.delete(likeRecord._id);
  },
});
