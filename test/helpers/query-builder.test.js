import test from 'ava';
import {propertySearchQuery} from '../../helpers/query-builder.js';

test('propertySearchQuery() creates correct query from all parameters',
    async (t) => {
      const searchParams = {
        search: 'search phrase',
        ownerId: '123',
        type: 'flat',
        status: 'listed',
        priority: 'normal',
        town: 'town',
        county: 'county',
        postcode: 'postcode',
        priceLow: '1',
        priceHigh: '100',
      };
      const expected = [
        {
          ownerId: '123',
        },
        {
          type: 'flat',
        },
        {
          status: 'listed',
        },
        {
          priority: 'normal',
        },
        {
          'location.town': 'town',
        },
        {
          'location.county': 'county',
        },
        {
          'location.postcode': {
            $options: 'i',
            $regex: '^postcode',
          },
        },
        {
          price: {
            $gte: 100,
          },
        },
        {
          price: {
            $lte: 10000,
          },
        },
        {
          $or: [
            {
              title: {
                $options: 'i',
                $regex: 'search phrase',
              },
            },
            {
              description: {
                $options: 'i',
                $regex: 'search phrase',
              },
            },
            {
              features: {
                $options: 'i',
                $regex: 'search phrase',
              },
            },
          ],
        },
      ];
      t.deepEqual(propertySearchQuery(searchParams), expected);
    });

test('propertySearchQuery() creates correct query form no parameters',
    async (t) => {
      const searchParams = {};
      const expected = [];
      t.deepEqual(propertySearchQuery(searchParams), expected);
    });

