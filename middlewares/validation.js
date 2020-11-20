/**
 * A module to run JSON Schema based validation on request/response data
 * @module middlewares/validation
 * @author Andris Jansons
 * @see schemas/* for JSON Schema definition files
 */

import JsonSchema from 'jsonschema';
import userSchema from '../schemas/user.json';
import roleSchema from '../schemas/role.json';
import propertySchema from '../schemas/property.json';

const {user, userCreate, userUpdate} = userSchema.definitions;
const {
  propertyCreate,
  propertyUpdate,
  propertyList,
} = propertySchema.definitions;

const validator = new JsonSchema.Validator();
validator.addSchema(userSchema);
validator.addSchema(roleSchema);
validator.addSchema(propertySchema);

/**
 * Wrapper that returns Koa middleware validator for a given schema
 * @param {object} schema JSON Schema definition
 * @param {string} resource Resource name
 * @param {boolean} query Whether to validate against query parameters or body
 * @return {function} A koa middleware handler
 */
function makeValidator(schema, resource, query = false) {
  return async (ctx, next) => {
    const body = query ? ctx.request.query : ctx.request.body;
    const validationOptions = {
      throwError: true,
      propertyName: resource,
    };
    try {
      validator.validate(body, schema, validationOptions);
      await next();
    } catch (err) {
      if (err instanceof JsonSchema.ValidationError) {
        ctx.status = 400;
        ctx.body = err;
      } else {
        throw err;
      }
    }
  };
}

/** Validate data against user schema */
export const validateUser = makeValidator(user, 'user');
/** Validate data against user schema for creating user */
export const validateUserCreate = makeValidator(userCreate, 'userCreate');
/** Validate data against user schema for updating user */
export const validateUserUpdate = makeValidator(userUpdate, 'userUpdate');

/** Validate data against property schema for creating */
export const validatePropertyCreate = makeValidator(
    propertyCreate, 'propertyCreate');
/** Validate data against property schema for updating */
export const validatePropertyUpdate = makeValidator(
    propertyUpdate, 'propertyUpdate');
/** Validate data against property schema for listing */
export const validatePropertyList = makeValidator(
    propertyList, 'propertyList', true);
