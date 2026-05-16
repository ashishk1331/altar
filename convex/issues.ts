import { v } from 'convex/values';
import { mutation } from './functions';
import { query } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';

export const writeIssue = mutation({
  args: { issue: v.string(), authorId: v.id('users') },
  handler: async (ctx, args) =>
    await ctx.db.insert('issues', {
      authorId: args.authorId,
      issue: args.issue,
      status: 'in_review',
    }),
});

export const getIssuesByUser = query({
  args: {
    authorId: v.id('users'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('issues')
      .withIndex('by_author', (q) => q.eq('authorId', args.authorId))
      .paginate(args.paginationOpts);
  },
});
