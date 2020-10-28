import mongoose from 'mongoose';
import Role from './role.model.js';

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

UserSchema.method('getRoles', async function() {
  // eslint-disable-next-line no-invalid-this
  return await Role.find({_id: {$in: this.roles}}).exec();
});

export default mongoose.model('User', UserSchema);
