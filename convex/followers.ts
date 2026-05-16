import { v } from 'convex/values';
import { mutation } from './functions';

export const followAuthor = mutation({
  args: { followee: v.id('users'), follower: v.id('users') },
  handler: async (ctx, args) =>
    await ctx.db.insert('followers', {
      followee: args.followee,
      follower: args.follower,
    }),
});

export const unfollowAuthor = mutation({
  args: { followee: v.id('users'), follower: v.id('users') },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query('followers')
      .filter((q) =>
        q.and(q.eq(q.field('followee'), args.followee), q.eq(q.field('follower'), args.follower))
      )
      .first();

    if (!record) return null;

    await ctx.db.delete(record._id);
  },
});
