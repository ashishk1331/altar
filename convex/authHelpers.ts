import { ConvexError } from 'convex/values';

import type { Doc } from './_generated/dataModel';
import type { MutationCtx, QueryCtx } from './_generated/server';

export async function getCurrentUserOrThrow(
  ctx: QueryCtx | MutationCtx
): Promise<Doc<'users'>> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError({ message: 'Not authenticated.', code: 401 });
  }
  const user = await ctx.db
    .query('users')
    .withIndex('by_google_id', (q) => q.eq('googleId', identity.subject))
    .first();
  if (!user) {
    throw new ConvexError({ message: 'User profile not found.', code: 404 });
  }
  return user;
}
