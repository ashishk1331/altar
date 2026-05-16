import type { DataModel } from './_generated/dataModel';
import { Triggers } from 'convex-helpers/server/triggers';
import {
  mutation as rawMutation,
  internalMutation as rawInternalMutation,
} from './_generated/server';
import { customCtx, customMutation } from 'convex-helpers/server/customFunctions';

const triggers = new Triggers<DataModel>();

triggers.register('comments', async (ctx, change) => {
  if (change.operation === 'insert') {
    const { poemId } = change.newDoc;
    const poem = await ctx.db.get(poemId);
    if (poem) {
      const newCommentCount = (poem.commentCount ?? 0) + 1;
      await ctx.db.patch(poemId, { commentCount: newCommentCount });
    }
  } else if (change.operation === 'delete') {
    const { poemId } = change.oldDoc;
    const poem = await ctx.db.get(poemId);
    if (poem) {
      const newCommentCount = Math.max(0, (poem.commentCount ?? 0) - 1);
      await ctx.db.patch(poemId, { commentCount: newCommentCount });
    }
  }
});

triggers.register('likes', async (ctx, change) => {
  if (change.operation === 'insert') {
    const { poemId } = change.newDoc;
    const poem = await ctx.db.get(poemId);
    if (poem) {
      const newLikeCount = (poem.likeCount ?? 0) + 1;
      await ctx.db.patch(poemId, { likeCount: newLikeCount });
    }
  } else if (change.operation === 'delete') {
    const { poemId } = change.oldDoc;
    const poem = await ctx.db.get(poemId);
    if (poem) {
      const newLikeCount = Math.max(0, (poem.likeCount ?? 0) - 1);
      await ctx.db.patch(poemId, { likeCount: newLikeCount });
    }
  }
});

triggers.register('followers', async (ctx, change) => {
  switch (change.operation) {
    case 'insert': {
      const { followee, follower } = change.newDoc;
      // Increase followee's follower count
      const followeeProfile = await ctx.db.get(followee);
      if (followeeProfile) {
        const newFollowerCount = (followeeProfile.followerCount ?? 0) + 1;
        await ctx.db.patch(followee, { followerCount: newFollowerCount });
      }
      // Increase follower's following count
      const followerProfile = await ctx.db.get(follower);
      if (followerProfile) {
        const newFollowingCount = (followerProfile.followingCount ?? 0) + 1;
        await ctx.db.patch(follower, { followingCount: newFollowingCount });
      }
      break;
    }
    case 'delete': {
      const { followee, follower } = change.oldDoc;
      // Decrease followee's follower count
      const followeeProfile = await ctx.db.get(followee);
      if (followeeProfile) {
        const newFollowerCount = Math.max(0, (followeeProfile.followerCount ?? 0) - 1);
        await ctx.db.patch(followee, { followerCount: newFollowerCount });
      }
      // Decrease follower's following count
      const followerProfile = await ctx.db.get(follower);
      if (followerProfile) {
        const newFollowingCount = Math.max(0, (followerProfile.followingCount ?? 0) - 1);
        await ctx.db.patch(follower, { followingCount: newFollowingCount });
      }
      break;
    }
  }
});

triggers.register('poems', async (ctx, change) => {
  switch (change.operation) {
    case 'insert': {
      const { authorId } = change.newDoc;
      const author = await ctx.db.get(authorId);
      if (author) {
        const newPostCount = (author.postCount ?? 0) + 1;
        await ctx.db.patch(authorId, { postCount: newPostCount });
      }
      break;
    }
    case 'delete': {
      const { authorId } = change.oldDoc;
      const author = await ctx.db.get(authorId);
      if (author) {
        const newPostCount = Math.max(0, (author.postCount ?? 0) - 1);
        await ctx.db.patch(authorId, { postCount: newPostCount });
      }
      break;
    }
  }
});

triggers.register('poems', async (ctx, change) => {
  if (change.operation === 'delete') {
    const { _id: poemId } = change.oldDoc;

    const comments = await ctx.db
      .query('comments')
      .filter((q) => q.eq(q.field('poemId'), poemId))
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    const likes = await ctx.db
      .query('likes')
      .filter((q) => q.eq(q.field('poemId'), poemId))
      .collect();

    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    const bookmarks = await ctx.db
      .query('bookmarks')
      .filter((q) => q.eq(q.field('poemId'), poemId))
      .collect();

    for (const bookmark of bookmarks) {
      await ctx.db.delete(bookmark._id);
    }
  }
});

export const mutation = customMutation(rawMutation, customCtx(triggers.wrapDB));
export const internalMutation = customMutation(rawInternalMutation, customCtx(triggers.wrapDB));
