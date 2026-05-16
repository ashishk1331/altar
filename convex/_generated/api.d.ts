/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { ApiFromModules, FilterApi, FunctionReference } from 'convex/server';
import type * as bookmarks from '../bookmarks.js';
import type * as comments from '../comments.js';
import type * as crons from '../crons.js';
import type * as followers from '../followers.js';
import type * as functions from '../functions.js';
import type * as issues from '../issues.js';
import type * as likes from '../likes.js';
import type * as notifications from '../notifications.js';
import type * as poems from '../poems.js';
import type * as users from '../users.js';

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  bookmarks: typeof bookmarks;
  comments: typeof comments;
  crons: typeof crons;
  followers: typeof followers;
  functions: typeof functions;
  issues: typeof issues;
  likes: typeof likes;
  notifications: typeof notifications;
  poems: typeof poems;
  users: typeof users;
}>;
export declare const api: FilterApi<typeof fullApi, FunctionReference<any, 'public'>>;
export declare const internal: FilterApi<typeof fullApi, FunctionReference<any, 'internal'>>;
