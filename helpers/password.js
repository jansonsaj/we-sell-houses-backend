/**
 * A module to encrypt and compare passwords and create create tokens
 * @module helpers/password
 * @author Andris Jansons
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthConfig from '../config/auth.js';

const saltRounds = 10;

/**
 * Generates a salt and hashes the password
 * @param {string} password User's raw password
 * @return {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compares the user's provided password with the
 * stored hashed password
 * @param {string} password User's password
 * @param {string} hashedPassword Stored hashed password
 * @return {Promise<boolean>} True if the passwords match
 */
export async function comparePasswords(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Creates a JSON Web Token with a signed user id
 * @param {string} userId User's identifier
 * @return {string} Signed JWT
 */
export function createToken(userId) {
  return jwt.sign({id: userId}, AuthConfig.SECRET_KEY, {
    expiresIn: '1 day',
  });
}
