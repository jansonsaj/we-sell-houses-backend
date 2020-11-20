/**
 * A module to provide auth middleware
 * @module middlewares/auth
 * @author Andris Jansons
 * @see middlewares/jwt For auth implementation using JSON Web Tokens
 */

import compose from 'koa-compose';
import {allowGuest, verifyToken, extractCallingUser} from './jwt.js';

/** Combines 2 middlewares: Verifies auth token and extracts calling user */
export const auth = compose([verifyToken, extractCallingUser]);

/** Allows guest access and authorizes users who provide
 * an authorization token */
export const guestOrAuth = compose(
    [allowGuest, verifyToken, extractCallingUser],
);
