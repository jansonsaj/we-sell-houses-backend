/**
 * A module with utility functions
 * @module helpers/query-builder
 * @author Andris Jansons
 */

/**
 * Converts the amount from pence to pounds
 * @param {number} amount The amount in pence
 * @return {string} Returns the amount in pounds
 */
export function penceToPounds(amount) {
  return (amount / 100).toFixed(2);
}

/**
   * Converts the amount from pounds to pence
   * @param {number} amount The amount in pounds
   * @return {number} Returns the amount in pence
   */
export function poundsToPence(amount) {
  return amount * 100;
}
