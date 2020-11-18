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
 * @param {User} user User document
 * @return {Ability} user's ability
 */
export const defineAbilitiesFor = async (user) => {
  const {can, cannot, rules} = new AbilityBuilder();
  const roleNames = (await user.getRoles()).map((role) => role.name);

  if (roleNames.includes(Roles.USER)) {
    can('read', User, ['id', 'email', 'roles'], {_id: user.id});
    can('update', User, ['email', 'password'], {_id: user.id});
    can('delete', User, {_id: user.id});

    can('read', Property, {status: {$ne: 'archived'}});
    can('read', Property, {ownerId: user.id});
    cannot('read', Property, ['location'], {ownerId: {$ne: user.id}});
    can('update', Property, {ownerId: user.id});
    can('delete', Property, {ownerId: user.id});
  }
  if (roleNames.includes(Roles.ADMIN)) {
    can('read', User);
    can('update', User);
    can('delete', User);

    can('read', Property);
    can('update', Property);
    can('delete', Property);
  }

  return new Ability(rules);
};
