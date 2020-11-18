import test from 'ava';
import {isValidSignUpCode} from '../../helpers/sign-up-codes.js';

test('isValidSignUpCode() returns true for a valid code', (t) => {
  t.true(isValidSignUpCode('we_sell_houses_agent'));
});

test('isValidSignUpCode() returns false for an invalid code', (t) => {
  t.false(isValidSignUpCode('invalid_code'));
});
