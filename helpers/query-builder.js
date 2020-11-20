/**
 * A module to build MongoDB queries
 * @module helpers/query-builder
 * @author Andris Jansons
 */

import {poundsToPence} from './utils.js';

/**
  * Builds a search query for Property documents from search parameters
  * @param {object} searchParams Object with optional search params
  * @return {object[]} Returns a search query
  */
export function propertySearchQuery(searchParams) {
  const {
    search,
    ownerId,
    type,
    status,
    priority,
    town,
    county,
    postcode,
    priceLow,
    priceHigh,
  } = searchParams;

  const query = [];
  if (ownerId) {
    query.push({ownerId});
  }
  if (type) {
    query.push({type});
  }
  if (status) {
    query.push({status});
  }
  if (priority) {
    query.push({priority});
  }
  if (town) {
    query.push({'location.town': town});
  }
  if (county) {
    query.push({'location.county': county});
  }
  if (postcode) {
    query.push({'location.postcode': {$regex: `^${postcode}`, $options: 'i'}});
  }
  if (priceLow) {
    query.push({price: {$gte: poundsToPence(priceLow)}});
  }
  if (priceHigh) {
    query.push({price: {$lte: poundsToPence(priceHigh)}});
  }
  if (search) {
    const searchRegex = {$regex: search, $options: 'i'};
    query.push({
      $or: [
        {title: searchRegex},
        {description: searchRegex},
        {features: searchRegex},
      ],
    });
  }
  return query;
}
