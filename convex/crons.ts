import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

// Clean up notifications older than 10 days - runs daily at 2:00 AM UTC
crons.daily(
  'cleanup old notifications',
  { hourUTC: 2, minuteUTC: 0 },
  internal.notifications.deleteOldNotifications,
  { daysOld: 10 }
);

export default crons;
