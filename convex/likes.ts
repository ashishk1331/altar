import { v } from 'convex/values';
import { mutation } from './functions';

export const likePoem = mutation({
  args: {
    authorId: v.id('users'),
    poemId: v.id('poems'),
    poemAuthorId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const likeRecord = await ctx.db.insert('likes', {
      authorId: args.authorId,
      poemId: args.poemId,
    });

    if (args.poemAuthorId && args.authorId !== args.poemAuthorId)
      await ctx.db.insert('notifications', {
        authorId: args.poemAuthorId,
        type: 'like',
        poemId: args.poemId,
        fromAuthorId: args.authorId,
        createdAt: Date.now(),
        read: false,
      });

    return likeRecord;
  },
});

export const dislikePoem = mutation({
  args: {
    authorId: v.id('users'),
    poemId: v.id('poems'),
    poemAuthorId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const likeRecord = await ctx.db
      .query('likes')
      .filter((q) =>
        q.and(q.eq(q.field('poemId'), args.poemId), q.eq(q.field('authorId'), args.authorId))
      )
      .first();

    if (!likeRecord) throw new Error('Record not found.');

    if (args.poemAuthorId && args.authorId !== args.poemAuthorId) {
      const notificationRecord = await ctx.db
        .query('notifications')
        .filter((q) =>
          q.and(
            q.eq(q.field('authorId'), args.poemAuthorId),
            q.eq(q.field('poemId'), args.poemId),
            q.eq(q.field('fromAuthorId'), args.authorId)
          )
        )
        .first();
      if (notificationRecord) await ctx.db.delete(notificationRecord._id);
    }

    await ctx.db.delete(likeRecord._id);
  },
});
