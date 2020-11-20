/**
 * A module to define the Property database model and schema
 * @module models/property
 * @author Andris Jansons
 * @see schemas/property.json for equivalent JSON schema
 */

import mongoose from 'mongoose';
import User from './user.js';
import {penceToPounds, poundsToPence} from '../helpers/utils.js';

export const Priorities = ['normal', 'high'];
export const Statuses = ['listed', 'underOffer', 'archived'];
export const Types = ['commercial', 'terrace', 'endOfTerrace',
  'flat', 'detached', 'semiDetached', 'cottage', 'bungalow', 'mansion'];

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: Types,
    required: true,
  },
  status: {
    type: String,
    enum: Statuses,
    default: 'listed',
  },
  features: [String],
  priority: {
    type: String,
    enum: Priorities,
    default: 'normal',
  },
  price: {
    type: Number,
    min: 0,
    get: getPrice,
    set: setPrice,
  },
  location: {
    type: {
      addressLine1: {
        type: String,
        required: true,
        maxlength: 255,
      },
      addressLine2: {
        type: String,
        maxlength: 255,
      },
      town: {
        type: String,
        required: true,
        maxlength: 35,
      },
      county: {
        type: String,
        maxlength: 35,
      },
      postcode: {
        type: String,
        required: true,
        maxlength: 8,
      },
    },
    required: false,
  },
}, {timestamps: true});

/**
 * Custom price getter.
 * Gets price as pounds, while stores it as pence.
 * @param {number} price The raw stored price
 * @return {string} Returns the price as string with 2 decimal places
 */
function getPrice(price) {
  return penceToPounds(price);
}

/**
 * Custom price setter.
 * Receives as pounds, while stores it as pence.
 * @param {number} price The price in pounds to store
 * @return {number} Returns the price in pence
 */
function setPrice(price) {
  return poundsToPence(price);
}

/**
 * Adds a method getOwner() to Property schema,
 * which extracts the owner User using ownerId
 */
PropertySchema.method('getOwner', async function() {
  // eslint-disable-next-line no-invalid-this
  return await User.findById(this.ownerId).exec();
});

/** Property mongoose model. Supports CRUD operations */
export default mongoose.model('Property', PropertySchema);
