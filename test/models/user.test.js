import test from 'ava';
import sinon from 'sinon';
import User from '../../models/user.js';
import Role from '../../models/role.js';

/**
 * A sample user to be used for testing
 * @return {User} sample user
 */
function sampleUser() {
  return new User({
    email: 'email@email.com',
    password: 'password',
    roles: [],
  });
}

test('getRoles() method invokes Role.find()', async (t) => {
  sinon.stub(Role, 'find')
      .returns({
        exec: () => ['roleArray'],
      });
  const roles = await sampleUser().getRoles();
  t.deepEqual(roles, ['roleArray']);
});
