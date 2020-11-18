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

test('User\'s can read their own User', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  t.true(ability.can('read', user));
});

test('User\'s can update their own User', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  t.true(ability.can('update', user));
});

test('User\'s can delete their own User', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  t.true(ability.can('delete', user));
});

test('User\'s can\'t read their password', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  t.false(user.accessibleFieldsBy(ability, 'read').includes('password'));
});

test('User\'s can\'t read other users', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  const otherUser = userWithId('other-id');
  t.true(ability.cannot('read', otherUser));
});

test('User\'s can\'t update other users', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  const otherUser = userWithId('other-id');
  t.true(ability.cannot('update', otherUser));
});

test('User\'s can\'t delete other users', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  const otherUser = userWithId('other-id');
  t.true(ability.cannot('delete', otherUser));
});

test('Admins can read all users', async (t) => {
  const admin = userWithRole('id', Roles.ADMIN);
  const ability = await defineAbilitiesFor(admin);
  const otherUser = userWithId('other-id');
  t.true(ability.can('read', otherUser));
});

test('Admins can update all users', async (t) => {
  const admin = userWithRole('id', Roles.ADMIN);
  const ability = await defineAbilitiesFor(admin);
  const otherUser = userWithId('other-id');
  t.true(ability.can('update', otherUser));
});

test('Admins can delete all users', async (t) => {
  const admin = userWithRole('id', Roles.ADMIN);
  const ability = await defineAbilitiesFor(admin);
  const otherUser = userWithId('other-id');
  t.true(ability.can('delete', otherUser));
});

test('User\'s can update their password', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  t.true(user.accessibleFieldsBy(ability, 'update').includes('password'));
});

test('User\'s can update their email', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  t.true(user.accessibleFieldsBy(ability, 'update').includes('email'));
});

test('User\'s can\'t update their id', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  t.false(user.accessibleFieldsBy(ability, 'update').includes('id'));
});

test('User\'s can\'t update their roles', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  t.false(user.accessibleFieldsBy(ability, 'update').includes('roles'));
});

test('Admins can read all properties', async (t) => {
  const admin = userWithRole('id', Roles.ADMIN);
  const ability = await defineAbilitiesFor(admin);
  const property = propertyWithOwnerId('other-id');
  t.true(ability.can('read', property));
});

test('Admins can update all properties', async (t) => {
  const admin = userWithRole('id', Roles.ADMIN);
  const ability = await defineAbilitiesFor(admin);
  const property = propertyWithOwnerId('other-id');
  t.true(ability.can('update', property));
});

test('Admins can delete all properties', async (t) => {
  const admin = userWithRole('id', Roles.ADMIN);
  const ability = await defineAbilitiesFor(admin);
  const property = propertyWithOwnerId('other-id');
  t.true(ability.can('delete', property));
});

test('Users can read other properties', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  const property = propertyWithOwnerId('other-id');
  t.true(ability.can('read', property));
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

test('Users can update their properties', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  const property = propertyWithOwnerId('id');
  t.true(ability.can('update', property));
});

test('Users cannot update other properties', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  const property = propertyWithOwnerId('other-id');
  t.true(ability.cannot('update', property));
});

test('Users can delete their properties', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  const property = propertyWithOwnerId('id');
  t.true(ability.can('delete', property));
});

test('Users cannot delete other properties', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  const property = propertyWithOwnerId('other-id');
  t.true(ability.cannot('delete', property));
});

test('Users can read their property location', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  const property = propertyWithOwnerId('id');
  t.true(property.accessibleFieldsBy(ability, 'read').includes('location'));
});

test('Users cannot read other property location', async (t) => {
  const user = userWithRole('id', Roles.USER);
  const ability = await defineAbilitiesFor(user);
  const property = propertyWithOwnerId('other-id');
  t.false(property.accessibleFieldsBy(ability, 'read').includes('location'));
});
