import mongoose from 'mongoose';
import DB_CONFIG from '../config/db.js';
import ROLES from '../config/roles.js';
import User from './user.model.js';
import Role from './role.model.js';

async function connect() {
	await mongoose.connect(`mongodb://${DB_CONFIG.HOST}/${DB_CONFIG.DB}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	setUp();
}

async function setUp() {
	const roleCount = await Role.countDocuments().exec();
	if (roleCount === 0) {
		Object.values(ROLES).forEach(roleName => {
			console.log(`Creating role: ${roleName}`);
			new Role({ name: roleName }).save();
		});
	}
}

export default {
	connect,
};
