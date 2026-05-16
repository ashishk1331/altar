import { ConvexError, v } from 'convex/values';
import type { Doc } from './_generated/dataModel';
import { query } from './_generated/server';
import { mutation } from './functions';
import { getCurrentUserOrThrow } from './authHelpers';

export const upsertUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: 'Not authenticated.', code: 401 });
    }
    if (!identity.email) {
      throw new ConvexError({ message: 'Google identity missing email.', code: 400 });
    }

    const googleId = identity.subject;
    const email = identity.email;
    const firstName = identity.givenName ?? '';
    const lastName = identity.familyName ?? '';
    const name = identity.name ?? (`${firstName} ${lastName}`.trim() || email);
    const picture = identity.pictureUrl ?? '';

    const byGoogleId = await ctx.db
      .query('users')
      .withIndex('by_google_id', (q) => q.eq('googleId', googleId))
      .first();
    if (byGoogleId) return byGoogleId;

    const byEmail = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();
    if (byEmail) {
      await ctx.db.patch(byEmail._id, { googleId });
      return { ...byEmail, googleId };
    }

    const user = {
      email,
      name,
      firstName,
      lastName,
      picture,
      bio: '',
      followerCount: 0,
      followingCount: 0,
      postCount: 0,
      googleId,
    };
    const Id = await ctx.db.insert('users', user);
    return { _id: Id, _creationTime: Date.now(), ...user };
  },
});

export const readUser = query({
  args: { authorId: v.id('users'), userId: v.optional(v.id('users')) },
  handler: async (ctx, args) => {
    const author = await ctx.db.get(args.authorId);

    if (!author) {
      throw new ConvexError({ message: 'User not found.', code: 100 });
    }

    let isFollowing = false;
    if (args.userId) {
      const record = await ctx.db
        .query('followers')
        .filter((q) =>
          q.and(q.eq(q.field('followee'), args.authorId), q.eq(q.field('follower'), args.userId))
        )
        .first();
      if (record) {
        isFollowing = true;
      }
    }

    return { ...author, isFollowing };
  },
});

export const updateUser = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const payload: Partial<Doc<'users'>> = {};

    if (args.firstName !== undefined) payload.firstName = args.firstName;
    if (args.lastName !== undefined) payload.lastName = args.lastName;
    if (args.bio !== undefined) payload.bio = args.bio;

    await ctx.db.patch(user._id, payload);
  },
});
