/**
 * A module to define the User database model and schema
 * @module models/user
 * @author Andris Jansons
 * @see schemas/user.json for equivalent JSON schema
 */

import mongoose from 'mongoose';
import User from './user.js';
import Property from './property.js';

export const Statuses = ['sent', 'read', 'archived'];

const MessageSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Statuses,
    default: 'sent',
  },
  senderEmail: {
    type: String,
    required: true,
  },
  senderPhone: {
    type: String,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  receiverUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

/**
 * Adds a method getReceiverUser() to Message schema,
 * which extracts the receiver User using receiverUserId
 */
MessageSchema.method('getReceiverUser', async function() {
  // eslint-disable-next-line no-invalid-this
  return await User.findById(this.receiverUserId).exec();
});

/**
 * Adds a method getOwner() to Message schema,
 * which extracts the Property using propertyId
 */
MessageSchema.method('getProperty', async function() {
  // eslint-disable-next-line no-invalid-this
  return await Property.findById(this.propertyId).exec();
});


/** Message mongoose model. Supports CRUD operations */
export default mongoose.model('Message', MessageSchema);
