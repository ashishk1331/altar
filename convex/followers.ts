import { ConvexError, v } from 'convex/values';
import { mutation } from './functions';
import { getCurrentUserOrThrow } from './authHelpers';

export const followAuthor = mutation({
  args: { followee: v.id('users') },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (args.followee === user._id) {
      throw new ConvexError({ message: 'Cannot follow yourself.', code: 400 });
    }
    const existing = await ctx.db
      .query('followers')
      .filter((q) =>
        q.and(q.eq(q.field('followee'), args.followee), q.eq(q.field('follower'), user._id))
      )
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert('followers', {
      followee: args.followee,
      follower: user._id,
    });
  },
});

export const unfollowAuthor = mutation({
  args: { followee: v.id('users') },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const record = await ctx.db
      .query('followers')
      .filter((q) =>
        q.and(q.eq(q.field('followee'), args.followee), q.eq(q.field('follower'), user._id))
      )
      .first();

    if (!record) return null;

    await ctx.db.delete(record._id);
  },
});
