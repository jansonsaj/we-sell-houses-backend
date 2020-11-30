import test from 'ava';
import sinon from 'sinon';
// Required to apply accessibleFieldsBy() plugin
import '../../helpers/setup.js';
import {defineAbilitiesFor} from '../../permissions/users.js';
import User from '../../models/user.js';
import Property from '../../models/property.js';
import Roles from '../../config/roles.js';

/**
 * A sample user with id to be used for testing
 * @param {string} id User id
 * @return {User} sample user
 */
function userWithId(id) {
  const user = new User({
    email: 'email@email.com',
    password: 'password',
    roles: [],
  });
  sinon.stub(user, 'id').get(() => id);
  sinon.stub(user, '_id').get(() => id);
  return user;
}
/**
 * A sample user with a role to be used for testing
 * @param {string} id User id
 * @param {string} roleName Name of the role to attach
 * @return {User} sample user
 */
function userWithRole(id, roleName) {
  const user = userWithId(id);
  user.getRoles = sinon.stub().resolves([
    {name: roleName},
  ]);
  return user;
}

/**
 * A sample property with specific owner id
 * @param {string} ownerId Property owner's user id
 * @return {Property} sample property
 */
function propertyWithOwnerId(ownerId) {
  const property = new Property({
    title: 'title',
    description: 'description',
    type: 'flat',
    features: ['has garden'],
    price: 100.00,
    location: {
      addressLine1: 'address line 1',
      addressLine2: 'address line 2',
      town: 'town',
      county: 'county',
      postcode: 'postcode',
    },
  });
  sinon.stub(property, 'ownerId').get(() => ownerId);
  return property;
}

/**
 * A sample message with specific receiver user id
 * @param {string} receiverUserId Message receiver user id
 * @return {Property} sample message
 */
function messageWithReceiverUserId(receiverUserId) {
  const message = new Message({
    body: 'message body',
    senderEmail: 'email@email.com',
    senderPhone: '12345678',
  });
  sinon.stub(message, 'receiverUserId').get(() => receiverUserId);
  return message;
}

// Users can {action} their own user
['read', 'update', 'delete'].forEach((action) => {
  test(`Users can ${action} their own user`, async (t) => {
    const user = userWithRole('id', Roles.USER);
    const ability = await defineAbilitiesFor(user);
    t.true(ability.can(action, user));
  });
});

test('User\'s can\'t read their password', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  t.false(user.accessibleFieldsBy(ability, 'read').includes('password'));
});

// Users cannot {action} other users
['read', 'update', 'delete'].forEach((action) => {
  test(`Users cannot ${action} all properties`, async (t) => {
    const user = userWithRole('id', Roles.USER);
    const ability = await defineAbilitiesFor(user);
    const otherUser = userWithId('other-id');
    t.true(ability.cannot(action, otherUser));
  });
});

// Admins can {action} all users
['read', 'update', 'delete'].forEach((action) => {
  test(`Admins can ${action} all users`, async (t) => {
    const admin = userWithRole('id', Roles.ADMIN);
    const ability = await defineAbilitiesFor(admin);
    const otherUser = userWithId('other-id');
    t.true(ability.can(action, otherUser));
  });
});

// Users {access} update their {field}
[
  {access: 'can', field: 'password'},
  {access: 'can', field: 'email'},
  {access: 'cannot', field: 'id'},
  {access: 'cannot', field: 'roles'},
].forEach(({access, field}) => {
  test(`Users ${access} update their ${field}`, async (t) => {
    const user = userWithRole('id', Roles.USER);
    const ability = await defineAbilitiesFor(user);
    t[access === 'can' ? 'true': 'false'](
        user.accessibleFieldsBy(ability, 'update').includes(field),
    );
  });
});

// Admins can {action} all properties
['read', 'update', 'delete'].forEach((action) => {
  test(`Admins can ${action} all properties`, async (t) => {
    const admin = userWithRole('id', Roles.ADMIN);
    const ability = await defineAbilitiesFor(admin);
    const property = propertyWithOwnerId('other-id');
    t.true(ability.can(action, property));
  });
});

// Users can {action} their properties
['read', 'update', 'delete'].forEach((action) => {
  test(`Users can ${action} their properties`, async (t) => {
    const user = userWithRole('id', Roles.USER);
    const ability = await defineAbilitiesFor(user);
    const property = propertyWithOwnerId('id');
    t.true(ability.can(action, property));
  });
});

// Users {access} {action} other properties
[
  {access: 'can', action: 'read'},
  {access: 'cannot', action: 'update'},
  {access: 'cannot', action: 'delete'},
].forEach(({access, action}) => {
  test(`Users ${access} ${action} other properties`, async (t) => {
    const user = userWithRole('id', Roles.USER);
    const ability = await defineAbilitiesFor(user);
    const property = propertyWithOwnerId('other-id');
    t.true(ability[access](action, property));
  });
});

test('Users cannot read other archived properties', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  const property = propertyWithOwnerId('other-id');
  property.status = 'archived';
  t.true(ability.cannot('read', property));
});

test('Users can read their archived properties', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  const property = propertyWithOwnerId('id');
  property.status = 'archived';
  t.true(ability.can('read', property));
});

// Guests {access} {action} properties
[
  {access: 'can', action: 'read'},
  {access: 'cannot', action: 'update'},
  {access: 'cannot', action: 'delete'},
].forEach(({access, action}) => {
  test(`Guests ${access} ${action} properties`, async (t) => {
    const ability = await defineAbilitiesFor(null);
    const property = propertyWithOwnerId('id');
    t.true(ability[access](action, property));
  });
});
