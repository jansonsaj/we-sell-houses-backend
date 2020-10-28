import test from 'ava';
import sinon from 'sinon';
// Required to apply accessibleFieldsBy() plugin
import '../../helpers/setup.js';
import {defineAbilitiesFor} from '../../permissions/users.js';
import User from '../../models/user.model.js';
import Roles from '../../config/roles.js';

/**
 * A sample user with id to be used for testing
 * @param {string} id User id
 * @return {User} sample user
 */
function userWithId(id) {
  return new User({
    id: id,
    email: 'email@email.com',
    password: 'password',
    roles: [],
  });
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
  t.false(user.accessibleFieldsBy(ability).includes('password'));
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

