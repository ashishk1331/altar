import { query } from './_generated/server';
import { v } from 'convex/values';
import { mutation } from './functions';

export const readCommentsOfPoem = query({
  args: { poemId: v.id('poems') },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query('comments')
      .withIndex('by_poem', (q) => q.eq('poemId', args.poemId))
      .order('desc')
      .collect();

    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.authorId);
        return {
          ...comment,
          author,
        };
      })
    );

    return commentsWithAuthors;
  },
});

export const writeComment = mutation({
  args: {
    poemId: v.id('poems'),
    body: v.string(),
    authorId: v.id('users'),
    poemAuthorId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const commentRecord = await ctx.db.insert('comments', {
      poemId: args.poemId,
      authorId: args.authorId,
      body: args.body,
    });

    if (args.poemAuthorId && args.authorId !== args.poemAuthorId)
      await ctx.db.insert('notifications', {
        authorId: args.poemAuthorId,
        type: 'comment',
        poemId: args.poemId,
        fromAuthorId: args.authorId,
        createdAt: Date.now(),
        read: false,
      });

    return commentRecord;
  },
});

export const deleteComment = mutation({
  args: {
    commentId: v.id('comments'),
    poemId: v.id('poems'),
    authorId: v.id('users'),
    poemAuthorId: v.id('users'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.commentId);

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
  },
});
