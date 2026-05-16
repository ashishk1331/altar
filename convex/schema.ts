import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  poems: defineTable({
    title: v.string(),
    body: v.string(),
    authorId: v.id('users'),
    likeCount: v.number(),
    commentCount: v.number(),
    isDraft: v.boolean(),
  })
    .index('by_author', ['authorId'])
    .index('by_author_and_is_draft', ['authorId', 'isDraft'])
    .searchIndex('search_title', {
      searchField: 'title',
      filterFields: ['isDraft'],
    }),

  bookmarks: defineTable({
    poemId: v.id('poems'),
    authorId: v.id('users'),
  })
    .index('by_author', ['authorId'])
    .index('by_author_poem', ['authorId', 'poemId']),

  users: defineTable({
    email: v.string(),
    bio: v.string(),
    name: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    picture: v.string(),
    followerCount: v.number(),
    followingCount: v.number(),
    postCount: v.number(),
  }).index('by_email', ['email']),

  followers: defineTable({
    followee: v.id('users'),
    follower: v.id('users'),
  })
    .index('by_followee', ['followee'])
    .index('by_follower', ['follower']),

  comments: defineTable({
    poemId: v.id('poems'),
    authorId: v.id('users'),
    body: v.string(),
  }).index('by_poem', ['poemId']),

  likes: defineTable({
    poemId: v.id('poems'),
    authorId: v.id('users'),
  })
    .index('by_author', ['authorId'])
    .index('by_author_poem', ['authorId', 'poemId']),

  issues: defineTable({
    issue: v.string(),
    authorId: v.id('users'),
    status: v.union(v.literal('in_review'), v.literal('solved')),
  }).index('by_author', ['authorId']),

  notifications: defineTable({
    authorId: v.id('users'),
    type: v.union(v.literal('like'), v.literal('comment')),
    poemId: v.id('poems'),
    fromAuthorId: v.id('users'),
    createdAt: v.number(),
    read: v.boolean(),
  })
    .index('by_author', ['authorId'])
    .index('by_author_and_read', ['authorId', 'read']),
});
