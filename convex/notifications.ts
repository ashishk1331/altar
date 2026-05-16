import { query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';
import { internalMutation, mutation } from './functions';
import { getCurrentUserOrThrow } from './authHelpers';

export const readNotifications = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const paginatedNotifications = await ctx.db
      .query('notifications')
      .withIndex('by_author', (q) => q.eq('authorId', user._id))
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
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const unreadNotifications = await ctx.db
      .query('notifications')
      .withIndex('by_author_and_read', (q) => q.eq('authorId', user._id).eq('read', false))
      .collect();

    return unreadNotifications.length;
  },
});

export const markAsRead = mutation({
  args: { notificationId: v.id('notifications') },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const notification = await ctx.db.get(args.notificationId);
    if (!notification) throw new ConvexError({ message: 'Notification not found.', code: 404 });
    if (notification.authorId !== user._id) {
      throw new ConvexError({ message: 'Not allowed.', code: 403 });
    }
    await ctx.db.patch(args.notificationId, { read: true });
  },
});

export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const unreadNotifications = await ctx.db
      .query('notifications')
      .withIndex('by_author_and_read', (q) => q.eq('authorId', user._id).eq('read', false))
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

    const oldNotifications = await ctx.db
      .query('notifications')
      .filter((q) => q.lt(q.field('_creationTime'), cutoffDate.getTime()))
      .collect();

    for (const notification of oldNotifications) {
      await ctx.db.delete(notification._id);
    }

    console.log(`Deleted ${oldNotifications.length} old notifications`);
  },
});
