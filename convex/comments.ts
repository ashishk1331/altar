import { query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { mutation } from './functions';
import { getCurrentUserOrThrow } from './authHelpers';

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
  args: { poemId: v.id('poems'), body: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const poem = await ctx.db.get(args.poemId);
    if (!poem) throw new ConvexError({ message: 'Poem not found.', code: 404 });

    const commentRecord = await ctx.db.insert('comments', {
      poemId: args.poemId,
      authorId: user._id,
      body: args.body,
    });

    if (poem.authorId !== user._id) {
      await ctx.db.insert('notifications', {
        authorId: poem.authorId,
        type: 'comment',
        poemId: args.poemId,
        fromAuthorId: user._id,
        createdAt: Date.now(),
        read: false,
      });
    }

    return commentRecord;
  },
});

export const deleteComment = mutation({
  args: { commentId: v.id('comments') },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new ConvexError({ message: 'Comment not found.', code: 404 });
    if (comment.authorId !== user._id) {
      throw new ConvexError({ message: 'Not allowed to delete this comment.', code: 403 });
    }

    const poem = await ctx.db.get(comment.poemId);

    await ctx.db.delete(args.commentId);

    if (poem && poem.authorId !== user._id) {
      const notificationRecord = await ctx.db
        .query('notifications')
        .filter((q) =>
          q.and(
            q.eq(q.field('authorId'), poem.authorId),
            q.eq(q.field('poemId'), comment.poemId),
            q.eq(q.field('fromAuthorId'), user._id)
          )
        )
        .first();
      if (notificationRecord) await ctx.db.delete(notificationRecord._id);
    }
  },
});
