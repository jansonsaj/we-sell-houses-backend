/**
 * A module to define the Role database model and schema
 * @module models/role
 * @author Andris Jansons
 * @see schemas/role.json for equivalent JSON schema
 */

import mongoose from 'mongoose';

/** Role mongoose model. Supports CRUD operations */
export default mongoose.model(
    'Role',
    new mongoose.Schema({
      name: {
        type: String,
        required: true,
        unique: true,
      },
    }),
);
