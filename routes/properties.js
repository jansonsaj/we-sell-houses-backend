/**
 * A module that specifies all routes on /properties path
 * @module routes/properties
 * @author Andris Jansons
 */

import Router from 'koa-router';
import pick from 'lodash/pick.js';
import {guestOrAuth, auth} from '../middlewares/auth.js';
import {defineAbilitiesFor} from '../permissions/users.js';
import {
  validatePropertyCreate,
  validatePropertyUpdate,
  validatePropertySearch,
} from '../middlewares/validation.js';
import Property from '../models/property.js';
import {propertySearchQuery} from '../helpers/query-builder.js';

const prefix = '/properties';
const router = new Router({prefix});

router.get('/', guestOrAuth, validatePropertySearch, getProperties);
router.post('/', auth, validatePropertyCreate, createProperty);
router.get('/:id', guestOrAuth, getProperty);
router.put('/:id', auth, validatePropertyUpdate, updateProperty);
router.del('/:id', auth, deleteProperty);

/**
 * Retrieves a filtered and paginated list of properties
 * @param {Context} ctx Koa Context
 */
async function getProperties(ctx) {
  try {
    const {
      page = 1,
      resultsPerPage = 10,
      sort = 'createdAt',
      sortDirection = 'desc',
      ...searchParams
    } = ctx.request.query;

    const sortExpression = sortDirection === 'desc' ? `-${sort}` : sort;
    const searchQuery = propertySearchQuery(searchParams);
    const ability = await defineAbilitiesFor(ctx.state.user);

    const properties = await Property
        .accessibleBy(ability, 'read')
        .and(searchQuery)
        .limit(Number(resultsPerPage))
        .skip((Number(page) - 1) * Number(resultsPerPage))
        .sort(sortExpression)
        .exec();

    const propertyCount = await Property
        .accessibleBy(ability, 'read')
        .and(searchQuery)
        .countDocuments()
        .exec();

    ctx.body = {
      properties: properties
          .map((p) => pick(p, p.accessibleFieldsBy(ability, 'read'))),
      page: Number(page),
      resultsPerPage: Number(resultsPerPage),
      propertyCount,
      pageCount: Math.ceil(propertyCount / resultsPerPage),
      links: {
        create: `${ctx.protocol}://${ctx.host}${prefix}/`,
      },
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
}

/**
 * Adds a new property
 * @param {Context} ctx Koa Context
 */
async function createProperty(ctx) {
  try {
    const propertyDetails = ctx.request.body;
    const property = await new Property({
      ownerId: ctx.state.user.id,
      ...propertyDetails,
    }).save();

    const ability = await defineAbilitiesFor(ctx.state.user);

    ctx.status = 201;
    ctx.body = pick(property, property.accessibleFieldsBy(ability, 'read'));
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
}

/**
 * Get a specific property
 * @param {Context} ctx Koa Context
 */
async function getProperty(ctx) {
  try {
    const id = ctx.params.id;
    const property = await Property.findById(id).exec();

    if (!property) {
      ctx.status = 404;
      ctx.body = 'The requested property does not exist';
      return;
    }

    const ability = await defineAbilitiesFor(ctx.state.user);

    if (ability.cannot('read', property)) {
      ctx.status = 401;
      ctx.body = 'You don\'t have permissions to read this property';
      return;
    }

    ctx.status = 200;
    ctx.body = pick(property, property.accessibleFieldsBy(ability, 'read'));
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
}

/**
 * Update an existing property
 * @param {Context} ctx Koa Context
 */
async function updateProperty(ctx) {
  try {
    const id = ctx.params.id;
    const property = await Property.findById(id).exec();

    if (!property) {
      ctx.status = 404;
      ctx.body = 'The requested property does not exist';
      return;
    }

    const ability = await defineAbilitiesFor(ctx.state.user);

    if (ability.cannot('update', property)) {
      ctx.status = 401;
      ctx.body = 'You don\'t have permissions to update this property';
      return;
    }

    const body = ctx.request.body;
    const accessibleFields = property.accessibleFieldsBy(ability, 'update');
    const updateProperty = pick(body, accessibleFields);
    Object.assign(property, updateProperty);
    await property.save();

    ctx.status = 200;
    ctx.body = pick(property, property.accessibleFieldsBy(ability, 'read'));
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
}

/**
 * Delete a property
 * @param {Context} ctx Koa Context
 */
async function deleteProperty(ctx) {
  try {
    const id = ctx.params.id;
    const property = await Property.findById(id).exec();

    if (!property) {
      ctx.status = 404;
      ctx.body = 'The requested property does not exist';
      return;
    }

    const ability = await defineAbilitiesFor(ctx.state.user);

    if (ability.cannot('delete', property)) {
      ctx.status = 401;
      ctx.body = 'You don\'t have permissions to delete this property';
      return;
    }

    await property.delete();

    ctx.status = 200;
    ctx.body = pick(property, property.accessibleFieldsBy(ability, 'read'));
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
  }
}

export default router;
