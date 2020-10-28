import jwt from 'jsonwebtoken';
import AuthConfig from '../config/auth.js';
import User from '../models/user.model.js';

const authorizationHeader = 'x-access-token';

/**
 * Verifies the user's token and stores the user's id
 * in ctx.state.userId. If the token is invalid or expired,
 * returns status 401 (Unauthorized).
 * @param {Context} ctx Koa Context
 * @param {Next} next Koa Next
 */
export async function verifyToken(ctx, next) {
  try {
    const token = ctx.get(authorizationHeader);
    if (!token) {
      ctx.status = 400;
      ctx.body = 'You need to provide an authorization ' +
      `token in ${authorizationHeader} header`;
      return;
    }
    const decoded = jwt.verify(token, AuthConfig.SECRET_KEY);
    ctx.state.userId = decoded.id;
    await next();
  } catch {
    ctx.status = 401;
    ctx.body = 'Unauthorized. You are trying to access a protected resource';
  }
}

/**
 * Finds the user based on ctx.state.userId and stores
 * the user in ctx.state.user.
 * @param {Context} ctx Koa Context
 * @param {Next} next Koa Next
 */
export async function extractCallingUser(ctx, next) {
  try {
    const user = await User.findById(ctx.state.userId).exec();
    if (!user) {
      ctx.status = 401;
      ctx.body = 'Unauthorized. You are trying to access a protected resource';
      return;
    }
    ctx.state.user = user;
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = 'Unauthorized. You are trying to access a protected resource';
  }
}
