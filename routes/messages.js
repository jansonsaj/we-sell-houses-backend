/**
 * A module that specifies all routes on /messages path
 * @module routes/messages
 * @author Andris Jansons
 */

import Router from 'koa-router';
import pick from 'lodash/pick.js';
import {auth} from '../middlewares/auth.js';
import {defineAbilitiesFor} from '../permissions/users.js';
import {
  validateMessageCreate,
  validateMessageUpdate,
  validateMessageSearch,
} from '../middlewares/validation.js';
import Message from '../models/message.js';
import {messageSearchQuery} from '../helpers/query-builder.js';

const router = new Router({prefix: '/messages'});

router.get('/', auth, validateMessageSearch, getMessages);
router.post('/', validateMessageCreate, createMessage);
router.get('/:id', auth, getMessage);
router.put('/:id', auth, validateMessageUpdate, updateMessage);
router.del('/:id', auth, deleteMessage);

/**
 * Retrieves a filtered and paginated list of messages
 * @param {Context} ctx Koa Context
 */
async function getMessages(ctx) {
  try {
    const {
      page = 1,
      resultsPerPage = 10,
      sort = 'createdAt',
      sortDirection = 'desc',
      ...searchParams
    } = ctx.request.query;

    const sortExpression = sortDirection === 'desc' ? `-${sort}` : sort;
    const searchQuery = messageSearchQuery(searchParams);
    const ability = await defineAbilitiesFor(ctx.state.user);

    const messages = await Message
        .accessibleBy(ability, 'read')
        .and(searchQuery)
        .limit(Number(resultsPerPage))
        .skip((Number(page) - 1) * Number(resultsPerPage))
        .sort(sortExpression)
        .exec();

    const messageCount = await Message
        .accessibleBy(ability, 'read')
        .and(searchQuery)
        .countDocuments()
        .exec();

    ctx.body = {
      messages: messages
          .map((p) => pick(p, p.accessibleFieldsBy(ability, 'read'))),
      page: Number(page),
      resultsPerPage: Number(resultsPerPage),
      messageCount,
      pageCount: Math.ceil(messageCount / resultsPerPage),
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
}

/**
 * Adds a new message
 * @param {Context} ctx Koa Context
 */
async function createMessage(ctx) {
  try {
    const messageDetails = ctx.request.body;
    const message = await new Message(messageDetails).save();

    const ability = await defineAbilitiesFor(ctx.state.user);

    ctx.status = 201;
    ctx.body = pick(message, message.accessibleFieldsBy(ability, 'read'));
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
}

/**
 * Get a specific message
 * @param {Context} ctx Koa Context
 */
async function getMessage(ctx) {
  try {
    const id = ctx.params.id;
    const message = await Message.findById(id).exec();

    if (!message) {
      ctx.status = 404;
      ctx.body = 'The requested message does not exist';
      return;
    }

    const ability = await defineAbilitiesFor(ctx.state.user);

    if (ability.cannot('read', message)) {
      ctx.status = 401;
      ctx.body = 'You don\'t have permissions to read this message';
      return;
    }

    ctx.status = 200;
    ctx.body = pick(message, message.accessibleFieldsBy(ability, 'read'));
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
}

/**
 * Update an existing message
 * @param {Context} ctx Koa Context
 */
async function updateMessage(ctx) {
  try {
    const id = ctx.params.id;
    const message = await Message.findById(id).exec();

    if (!message) {
      ctx.status = 404;
      ctx.body = 'The requested message does not exist';
      return;
    }

    const ability = await defineAbilitiesFor(ctx.state.user);

    if (ability.cannot('update', message)) {
      ctx.status = 401;
      ctx.body = 'You don\'t have permissions to update this message';
      return;
    }

    const body = ctx.request.body;
    const accessibleFields = message.accessibleFieldsBy(ability, 'update');
    const updateMessage = pick(body, accessibleFields);
    Object.assign(message, updateMessage);
    await message.save();

    ctx.status = 200;
    ctx.body = pick(message, message.accessibleFieldsBy(ability, 'read'));
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
}

/**
 * Delete a message
 * @param {Context} ctx Koa Context
 */
async function deleteMessage(ctx) {
  try {
    const id = ctx.params.id;
    const message = await Message.findById(id).exec();

    if (!message) {
      ctx.status = 404;
      ctx.body = 'The requested message does not exist';
      return;
    }

    const ability = await defineAbilitiesFor(ctx.state.user);

    if (ability.cannot('delete', message)) {
      ctx.status = 401;
      ctx.body = 'You don\'t have permissions to delete this message';
      return;
    }

    await message.delete();

    ctx.status = 200;
    ctx.body = pick(message, message.accessibleFieldsBy(ability, 'read'));
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
}

export default router;
