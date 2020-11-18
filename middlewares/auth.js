/**
 * A module to provide auth middleware
 * @module middlewares/auth
 * @author Andris Jansons
 * @see middlewares/jwt For auth implementation using JSON Web Tokens
 */

import compose from 'koa-compose';
import {verifyToken, extractCallingUser} from './jwt.js';

/** Combines 2 middlewares: Verifies auth token and extracts calling user */
export default compose([verifyToken, extractCallingUser]);
