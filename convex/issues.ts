import { v } from 'convex/values';
import { mutation } from './functions';
import { query } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';
import { getCurrentUserOrThrow } from './authHelpers';

export const writeIssue = mutation({
  args: { issue: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    return await ctx.db.insert('issues', {
      authorId: user._id,
      issue: args.issue,
      status: 'in_review',
    });
  },
});

export const getIssuesByUser = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    return await ctx.db
      .query('issues')
      .withIndex('by_author', (q) => q.eq('authorId', user._id))
      .paginate(args.paginationOpts);
  },
});
