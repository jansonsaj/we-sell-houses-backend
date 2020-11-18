/**
 * A module that validates sign-up codes.
 * Users need a sign-up code to be able to create an account.
 * @module helpers/sign-up-codes
 * @author Andris Jansons
 */

const signUpCodes = ['we_sell_houses_agent'];

/**
 * Checks if the provided sign-up code is valid
 * @param {string} code User's provided sign-up code
 * @return {boolean} Returns true if the code is valid
 */
export function isValidSignUpCode(code) {
  return signUpCodes.includes(code);
}
