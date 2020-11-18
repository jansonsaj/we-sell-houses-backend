/**
 * A module to define the User database model and schema
 * @module models/user
 * @author Andris Jansons
 * @see schemas/user.json for equivalent JSON schema
 */

import mongoose from 'mongoose';
import Role from './role.js';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
  ],
});

/**
 * Adds a method getRoles() to User schema,
 * which extracts role object from their IDs
 */
UserSchema.method('getRoles', async function() {
  // eslint-disable-next-line no-invalid-this
  return await Role.find({_id: {$in: this.roles}}).exec();
});

/** User mongoose model. Supports CRUD operations */
export default mongoose.model('User', UserSchema);
