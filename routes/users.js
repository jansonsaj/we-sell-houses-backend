import Router from 'koa-router';
import pick from 'lodash/pick.js';
import {
  hashPassword,
  comparePasswords,
  createToken,
} from '../helpers/password.js';
import auth from '../middlewares/auth.js';
import {defineAbilitiesFor} from '../permissions/users.js';
import Roles from '../config/roles.js';
import ErrorCodes from '../helpers/error-codes.js';
import User from '../models/user.model.js';
import Role from '../models/role.model.js';
import {validateUser, validateUserUpdate} from '../middlewares/validation.js';

const router = new Router({prefix: '/users'});

router.post('/', validateUser, createUser);
router.post('/signin', validateUser, signIn);
router.get('/', auth, getAll);
router.get('/:id', auth, getUser);
router.put('/:id', auth, validateUserUpdate, updateUser);
router.del('/:id', auth, deleteUser);

/**
 * Get all users
 * @param {Context} ctx Koa Context
 */
async function getAll(ctx) {
  const ability = await defineAbilitiesFor(ctx.state.user);
  const users = await User.accessibleBy(ability).exec();
  ctx.body = users
      .map((user) => pick(user, user.accessibleFieldsBy(ability, 'read')));
}

/**
 * Get a specific user
 * @param {Context} ctx Koa Context
 */
async function getUser(ctx) {
  try {
    const id = ctx.params.id;
    const user = await User.findById(id).exec();

    if (!user) {
      ctx.status = 404;
      ctx.body = 'The requested user does not exist';
      return;
    }

    const ability = await defineAbilitiesFor(ctx.state.user);

    if (ability.cannot('read', user)) {
      ctx.status = 401;
      ctx.body = 'You don\'t have permissions to read this user';
      return;
    }

    ctx.status = 200;
    ctx.body = pick(user, user.accessibleFieldsBy(ability, 'read'));
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
}

/**
 * Signs in the user and returns the JWT token
 * @param {Context} ctx Koa Context
 */
async function signIn(ctx) {
  const {email, password} = ctx.request.body;
  const user = await User.findOne({email}).exec();

  if (!user) {
    ctx.status = 400;
    ctx.body = 'There is no user with the provided email address';
    return;
  }

  const isPasswordValid = await comparePasswords(password, user.password);

  if (!isPasswordValid) {
    ctx.status = 401;
    ctx.body = 'The provided password was invalid';
    return;
  }

  const accessToken = createToken(user.id);
  ctx.status = 200;
  ctx.body = {
    id: user.id,
    accessToken,
  };
}

/**
 * Create a new user
 * @param {Context} ctx Koa Context
 */
async function createUser(ctx) {
  try {
    const body = ctx.request.body;
    const hashedPassword = await hashPassword(body.password);
    const role = await Role.findOne({name: Roles.USER}).exec();

    const user = await new User({
      email: body.email,
      password: hashedPassword,
      roles: [role.id],
    }).save();

    const ability = await defineAbilitiesFor(user);

    ctx.status = 201;
    ctx.body = pick(user, user.accessibleFieldsBy(ability, 'read'));
  } catch (err) {
    if (err.code === ErrorCodes.DUPLICATE_KEY) {
      ctx.status = 403;
      ctx.body = 'An account with that email address already exists.';
    } else {
      console.log(err);
      ctx.status = 500;
      ctx.body = 'Cannot create user';
    }
  }
}

/**
 * Updates an existing user
 * @param {Context} ctx Koa Context
 */
async function updateUser(ctx) {
  try {
    const id = ctx.params.id;
    const user = await User.findById(id).exec();

    if (!user) {
      ctx.status = 404;
      ctx.body = 'The requested user does not exist';
      return;
    }

    const ability = await defineAbilitiesFor(ctx.state.user);

    if (ability.cannot('update', user)) {
      ctx.status = 401;
      ctx.body = 'You don\'t have permissions to update this user';
      return;
    }

    const body = ctx.request.body;
    const updateUser = pick(body, user.accessibleFieldsBy(ability, 'update'));
    if (updateUser.password) {
      updateUser.password = await hashPassword(updateUser.password);
    }
    Object.assign(user, updateUser);
    await user.save();

    ctx.body = pick(user, user.accessibleFieldsBy(ability, 'read'));
    ctx.status = 200;
  } catch (err) {
    if (err.code === ErrorCodes.DUPLICATE_KEY) {
      ctx.status = 403;
      ctx.body = 'Another account with that email address already exists.';
    } else {
      console.log(err);
      ctx.status = 500;
      ctx.body = 'Cannot update user';
    }
  }
}

/**
 * Deletes a user
 * @param {Context} ctx Koa Context
 */
async function deleteUser(ctx) {
  try {
    const id = ctx.params.id;
    const user = await User.findById(id).exec();

    if (!user) {
      ctx.status = 404;
      ctx.body = 'The requested user does not exist';
      return;
    }

    const ability = await defineAbilitiesFor(ctx.state.user);

    if (ability.cannot('delete', user)) {
      ctx.status = 401;
      ctx.body = 'You don\'t have permissions to delete this user';
      return;
    }

    await User.findByIdAndDelete(id);
    ctx.status = 200;
    ctx.body = pick(user, user.accessibleFieldsBy(ability, 'read'));
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
}

export default router;
