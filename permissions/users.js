/**
 * A module that defines role based access policies for users
 * @module permissions/users
 * @author Andris Jansons
 */

import casl from '@casl/ability';
import Roles from '../config/roles.js';
import User from '../models/user.js';

const {Ability, AbilityBuilder} = casl;

/**
 * Get the Ability (permissions) that the
 * provided user has based on its roles.
 * @param {User} user User document
 * @return {Ability} user's ability
 */
export const defineAbilitiesFor = async (user) => {
  const {can, rules} = new AbilityBuilder();
  const roleNames = (await user.getRoles()).map((role) => role.name);

  if (roleNames.includes(Roles.USER)) {
    can('read', User, ['id', 'email', 'roles'], {_id: user.id});
    can('update', User, ['email', 'password'], {_id: user.id});
    can('delete', User, {_id: user.id});
  }
  if (roleNames.includes(Roles.ADMIN)) {
    can('read', User);
    can('update', User);
    can('delete', User);
  }

  return new Ability(rules);
};
