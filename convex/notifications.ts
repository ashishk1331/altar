import { query } from './_generated/server';
import { v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';
import { internalMutation, mutation } from './functions';

export const readNotifications = query({
  args: {
    userId: v.id('users'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const paginatedNotifications = await ctx.db
      .query('notifications')
      .withIndex('by_author', (q) => q.eq('authorId', args.userId))
      .order('desc')
      .paginate(args.paginationOpts);

    const notificationsWithDetails = await Promise.all(
      paginatedNotifications.page.map(async (notification) => {
        const [poem, fromAuthor] = await Promise.all([
          ctx.db.get(notification.poemId),
          ctx.db.get(notification.fromAuthorId),
        ]);

        return {
          ...notification,
          poem,
          fromAuthor,
        };
      })
    );

    return {
      ...paginatedNotifications,
      page: notificationsWithDetails,
    };
  },
});

export const getUnreadCount = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const unreadNotifications = await ctx.db
      .query('notifications')
      .withIndex('by_author_and_read', (q) => q.eq('authorId', args.userId).eq('read', false))
      .collect();

    return unreadNotifications.length;
  },
});

export const markAsRead = mutation({
  args: {
    notificationId: v.id('notifications'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, { read: true });
  },
});

export const markAllAsRead = mutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const unreadNotifications = await ctx.db
      .query('notifications')
      .withIndex('by_author_and_read', (q) => q.eq('authorId', args.userId).eq('read', false))
      .collect();

    await Promise.all(
      unreadNotifications.map((notification) => ctx.db.patch(notification._id, { read: true }))
    );
  },
});

export const deleteOldNotifications = internalMutation({
  args: { daysOld: v.number() },
  handler: async (ctx, args) => {
    const cutoffDate = new Date(Date.now() - args.daysOld * 24 * 60 * 60 * 1000);

    // Query notifications older than cutoff date
    const oldNotifications = await ctx.db
      .query('notifications')
      .filter((q) => q.lt(q.field('_creationTime'), cutoffDate.getTime()))
      .collect();

    // Delete them
    for (const notification of oldNotifications) {
      await ctx.db.delete(notification._id);
    }

    console.log(`Deleted ${oldNotifications.length} old notifications`);
  },
});
