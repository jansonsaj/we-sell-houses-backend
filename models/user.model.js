import mongoose from 'mongoose';

export default mongoose.model(
    'User',
    new mongoose.Schema({
      email: String,
      password: String,
      roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Role',
        },
      ],
    }),
);
