import test from 'ava';
import {
  hashPassword,
  comparePasswords,
  createToken,
} from '../../helpers/password.js';

test('hashPassword() creates a password hash', async (t) => {
  const hashedPassword = await hashPassword('password');
  t.true(hashedPassword.startsWith('$2b$10$'));
  t.is(hashedPassword.length, 60);
});

test('comparePasswords() returns true for a password and it\'s hash',
    async (t) => {
      const password = 'password';
      const hashedPassword = await hashPassword(password);
      const isValid = await comparePasswords(password, hashedPassword);
      t.true(isValid);
    },
);

test('comparePasswords() returns false when passwords don\'t match',
    async (t) => {
      const hashedPassword = await hashPassword('other-password');
      const isValid = await comparePasswords('password', hashedPassword);
      t.false(isValid);
    },
);

test('comparePasswords() returns false when hash is provided as password',
    async (t) => {
      const hashedPassword = await hashPassword('password');
      const isValid = await comparePasswords(hashedPassword, hashedPassword);
      t.false(isValid);
    },
);

test('createToken() encodes provided id',
    async (t) => {
      const token = await createToken('id123');
      t.true(Buffer.from(token, 'base64').toString().includes('"id":"id123"'));
    },
);
