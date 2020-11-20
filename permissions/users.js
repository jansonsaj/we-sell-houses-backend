/**
 * A module that defines role based access policies for users
 * @module permissions/users
 * @author Andris Jansons
 */

import casl from '@casl/ability';
import Roles from '../config/roles.js';
import User from '../models/user.js';
import Property from '../models/property.js';

const {Ability, AbilityBuilder} = casl;

/**
 * Get the Ability (permissions) that the
 * provided user has based on its roles.
 * @param {User | null} user User document or null for guests
 * @return {Ability} user's ability
 */
export const defineAbilitiesFor = async (user) => {
  const {can, rules} = new AbilityBuilder();

  // Abilities for guests (users that haven't logged in)
  can('read', Property, {status: {$ne: 'archived'}});

  if (user) {
    const userId = user.id;
    const roleNames = await getRoleNames(user);

    if (roleNames.includes(Roles.USER)) {
      can('read', User, ['id', 'email', 'roles'], {_id: userId});
      can('update', User, ['email', 'password'], {_id: userId});
      can('delete', User, {_id: userId});

      can('read', Property, {ownerId: userId});
      can('update', Property, {ownerId: userId});
      can('delete', Property, {ownerId: userId});
    }
    if (roleNames.includes(Roles.ADMIN)) {
      can('read', User);
      can('update', User);
      can('delete', User);

      can('read', Property);
      can('update', Property);
      can('delete', Property);
    }
  }

  return new Ability(rules);
};

/**
 * Get a list of role names associated with the user
 * @param {User} user user document
 * @return {string[]} Returns a list of role names
 */
async function getRoleNames(user) {
  return (await user.getRoles()).map((role) => role.name);
}

