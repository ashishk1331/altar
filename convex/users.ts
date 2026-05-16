import { ConvexError, v } from 'convex/values';
import type { Doc } from './_generated/dataModel';
import { query } from './_generated/server';
import { mutation } from './functions';

export const upsertUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    picture: v.string(),
  },
  handler: async (ctx, args) => {
    const user = {
      email: args.email,
      name: args.name,
      firstName: args.firstName,
      lastName: args.lastName,
      picture: args.picture,
      bio: '',
      followerCount: 0,
      followingCount: 0,
      postCount: 0,
    };
    const existing = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    if (!existing) {
      const Id = await ctx.db.insert('users', user);
      return { _id: Id, _creationTime: Date.now(), ...user };
    }
    return existing;
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
    userId: v.id('users'),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payload: Partial<Doc<'users'>> = {};

    if (args.firstName) {
      payload.firstName = args.firstName;
    }
    if (args.lastName) {
      payload.lastName = args.lastName;
    }
    if (args.bio) {
      payload.bio = args.bio;
    }

    await ctx.db.patch(args.userId, payload);
  },
});
