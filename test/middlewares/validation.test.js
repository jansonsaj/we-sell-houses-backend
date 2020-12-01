import test from 'ava';
import sinon from 'sinon';
import {
  validateUser,
  validateUserCreate,
  validateUserUpdate,
  validatePropertyCreate,
  validatePropertyUpdate,
  validatePropertySearch,
  validateMessageCreate,
  validateMessageUpdate,
  validateMessageSearch,
} from '../../middlewares/validation.js';

/**
 * A sample property used in testing
 * @return {object} Returns property obejct
 */
function sampleProperty() {
  return {
    title: 'title',
    description: 'description',
    type: 'flat',
    features: ['has garden', 'integrated kitchen'],
    status: 'listed',
    priority: 'normal',
    price: 100.00,
    location: {
      addressLine1: 'address line 1',
      addressLine2: 'address line 2',
      town: 'town',
      county: 'county',
      postcode: 'postcode',
    },
  };
}

/**
 * A sample property used in testing
 * @return {object} Returns list property object
 */
function sampleListProperty() {
  return {
    page: '1',
    resultsPerPage: '10',
    sort: 'createdAt',
    sortDirection: 'desc',
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
}

/**
 * A sample message used in testing
 * @return {Message} Returns message object
 */
function sampleMessage() {
  return {
    body: 'message body',
    senderEmail: 'email@email.com',
    senderPhone: '12345678',
    receiverUserId: '123',
    propertyId: '456',
  };
}

test('validateUser() with valid user calls next', async (t) => {
  const ctx = {
    request: {
      body: {
        id: '5f9855dadcdf590bc2905f71',
        email: 'email@email.com',
        password: 'password',
        roles: [
          '5f9855dadcdf590bc2905f72',
          '5f9855dadcdf590bc2905f73',
        ],
      },
    },
  };
  const next = sinon.stub();

  await validateUser(ctx, next);

  t.true(next.called);
});

test('validateUser() with invalid user email doesn\'t call next', async (t) => {
  const ctx = {
    request: {
      body: {
        email: 'not-valid-email.com',
        password: 'password',
      },
    },
  };
  const next = sinon.stub();

  await validateUser(ctx, next);

  t.is(ctx.status, 400);
  t.is(ctx.body.argument, 'email');
  t.true(next.notCalled);
});

test('validateUser() with invalid password doesn\'t call next', async (t) => {
  const ctx = {
    request: {
      body: {
        email: 'email@email.com',
        password: '123',
      },
    },
  };
  const next = sinon.stub();

  await validateUser(ctx, next);

  t.is(ctx.status, 400);
  t.is(ctx.body.message, 'does not meet minimum length of 6');
  t.true(next.notCalled);
});

test('validateUser() with missing parameters doesn\'t call next', async (t) => {
  const ctx = {
    request: {
      body: {},
    },
  };
  const next = sinon.stub();

  await validateUser(ctx, next);

  t.is(ctx.status, 400);
  t.is(ctx.body.message, 'requires property "email"');
  t.true(next.notCalled);
});

test('validateUserUpdate() with valid user calls next', async (t) => {
  const ctx = {
    request: {
      body: {
        email: 'email@email.com',
        password: 'password',
      },
    },
  };
  const next = sinon.stub();

  await validateUserUpdate(ctx, next);

  t.true(next.called);
});

test('validateUserUpdate() with invalid user email doesn\'t call next',
    async (t) => {
      const ctx = {
        request: {
          body: {
            email: 'not-valid-email.com',
            password: 'password',
          },
        },
      };
      const next = sinon.stub();

      await validateUserUpdate(ctx, next);

      t.is(ctx.status, 400);
      t.is(ctx.body.argument, 'email');
      t.true(next.notCalled);
    });

test('validateUserUpdate() with invalid password doesn\'t call next',
    async (t) => {
      const ctx = {
        request: {
          body: {
            email: 'email@email.com',
            password: '123',
          },
        },
      };
      const next = sinon.stub();

      await validateUserUpdate(ctx, next);

      t.is(ctx.status, 400);
      t.is(ctx.body.message, 'does not meet minimum length of 6');
      t.true(next.notCalled);
    });

test('validateUserUpdate() with missing parameters calls next', async (t) => {
  const ctx = {
    request: {
      body: {},
    },
  };
  const next = sinon.stub();

  await validateUserUpdate(ctx, next);

  t.true(next.called);
});


test('validateUserCreate() with valid user calls next', async (t) => {
  const ctx = {
    request: {
      body: {
        email: 'email@email.com',
        password: 'password',
        signUpCode: 'code',
      },
    },
  };
  const next = sinon.stub();

  await validateUserCreate(ctx, next);

  t.true(next.called);
});

test('validateUserCreate() with invalid user email doesn\'t call next',
    async (t) => {
      const ctx = {
        request: {
          body: {
            email: 'not-valid-email.com',
            password: 'password',
            signUpCode: 'code',
          },
        },
      };
      const next = sinon.stub();

      await validateUserCreate(ctx, next);

      t.is(ctx.status, 400);
      t.is(ctx.body.argument, 'email');
      t.true(next.notCalled);
    });

test('validateUserCreate() with invalid password doesn\'t call next',
    async (t) => {
      const ctx = {
        request: {
          body: {
            email: 'email@email.com',
            password: '123',
            signUpCode: 'code',
          },
        },
      };
      const next = sinon.stub();

      await validateUserCreate(ctx, next);

      t.is(ctx.status, 400);
      t.is(ctx.body.message, 'does not meet minimum length of 6');
      t.true(next.notCalled);
    });

test('validateUserCreate() with missing signUpCode doesn\'t call next',
    async (t) => {
      const ctx = {
        request: {
          body: {
            email: 'email@email.com',
            password: '123',
          },
        },
      };
      const next = sinon.stub();

      await validateUserCreate(ctx, next);

      t.true(next.notCalled);
    });

test('validateUserCreate() with missing parameters doesn\'t call next',
    async (t) => {
      const ctx = {
        request: {
          body: {},
        },
      };
      const next = sinon.stub();

      await validateUserCreate(ctx, next);

      t.true(next.notCalled);
    });

// Use the same test for all required parameters
['title', 'type'].forEach((requiredProperty) => {
  test(`validatePropertyCreate() without ${requiredProperty} doesn't call next`,
      async (t) => {
        const ctx = {
          request: {
            body: sampleProperty(),
          },
        };
        const next = sinon.stub();

        delete ctx.request.body[requiredProperty];

        await validatePropertyCreate(ctx, next);

        t.true(next.notCalled);
      });
});

// Test the same test cases for validatePropertyCreate()
// and validatePropertyUpdate() functions
[
  {name: 'validatePropertyCreate()', function: validatePropertyCreate},
  {name: 'validatePropertyUpdate()', function: validatePropertyUpdate},
].forEach((testCase) => {
  test(`${testCase.name} with valid property calls next`,
      async (t) => {
        const ctx = {
          request: {
            body: sampleProperty(),
          },
        };
        const next = sinon.stub();

        await testCase.function(ctx, next);

        t.true(next.called);
      });

  test(`${testCase.name} with negative price doesn't call next`,
      async (t) => {
        const ctx = {
          request: {
            body: sampleProperty(),
          },
        };
        ctx.request.body.price = -100;
        const next = sinon.stub();

        await testCase.function(ctx, next);

        t.is(ctx.status, 400);
        t.is(ctx.body.message, 'must be greater than or equal to 0');
        t.true(next.notCalled);
      });

  test(`${testCase.name} with incomplete location doesn't call next`,
      async (t) => {
        const ctx = {
          request: {
            body: sampleProperty(),
          },
        };
        delete ctx.request.body.location.addressLine1;
        const next = sinon.stub();

        await testCase.function(ctx, next);

        t.is(ctx.status, 400);
        t.is(ctx.body.message, 'requires property "addressLine1"');
        t.true(next.notCalled);
      });
});

test(`validatePropertySearch() with a valid request calls next`,
    async (t) => {
      const ctx = {
        request: {
          query: sampleListProperty(),
        },
      };
      const next = sinon.stub();

      await validatePropertySearch(ctx, next);

      t.true(next.called);
    });

test(`validatePropertySearch() with a negative low price doesn't call next`,
    async (t) => {
      const ctx = {
        request: {
          query: sampleListProperty(),
        },
      };
      ctx.request.query.priceLow = '-100';
      const next = sinon.stub();

      await validatePropertySearch(ctx, next);

      t.is(ctx.status, 400);
      t.is(ctx.body.property, 'instance.priceLow');
      t.true(next.notCalled);
    });

test(`validatePropertySearch() with a negative high price doesn't call next`,
    async (t) => {
      const ctx = {
        request: {
          query: sampleListProperty(),
        },
      };
      ctx.request.query.priceHigh = '-100';
      const next = sinon.stub();

      await validatePropertySearch(ctx, next);

      t.is(ctx.status, 400);
      t.is(ctx.body.property, 'instance.priceHigh');
      t.true(next.notCalled);
    });

test(`validatePropertySearch() with no parameters calls next`,
    async (t) => {
      const ctx = {
        request: {
          query: {},
        },
      };
      const next = sinon.stub();

      await validatePropertySearch(ctx, next);

      t.true(next.called);
    });

test(`validateMessageCreate() with valid message calls next`, async (t) => {
  const ctx = {
    request: {
      body: sampleMessage(),
    },
  };
  const next = sinon.stub();

  await validateMessageCreate(ctx, next);

  t.true(next.called);
});

test(`validateMessageCreate() with additional parameters doesn't call next`,
    async (t) => {
      const ctx = {
        request: {
          body: sampleMessage(),
        },
      };
      ctx.request.body._id = 123;
      const next = sinon.stub();

      await validateMessageCreate(ctx, next);

      t.is(ctx.status, 400);
      t.is(ctx.body.message,
          'is not allowed to have the additional property "_id"');
      t.true(next.notCalled);
    });


test(`validateMessageUpdate() with only status calls next`, async (t) => {
  const ctx = {
    request: {
      body: {
        status: 'archived',
      },
    },
  };
  const next = sinon.stub();

  await validateMessageUpdate(ctx, next);

  t.true(next.called);
});

// Only status is updatable for a message, trying to update any other
// property should fail and not call next
[
  '_id', 'senderEmail', 'senderPhone',
  'body', 'receiverUserId', 'propertyId',
].forEach((nonUpdatableProperty) => {
  test(
      `validateMessageUpdate() with additional
      parameter ${nonUpdatableProperty} doesn't call next`,
      async (t) => {
        const ctx = {
          request: {
            body: {
              [nonUpdatableProperty]: '123',
            },
          },
        };
        const next = sinon.stub();

        await validateMessageUpdate(ctx, next);

        t.is(ctx.status, 400);
        t.is(ctx.body.message, 'is not allowed to have the ' +
            `additional property "${nonUpdatableProperty}"`);
        t.true(next.notCalled);
      });
});


test(`validateMessageSearch() with a valid request calls next`,
    async (t) => {
      const ctx = {
        request: {
          query: {
            page: '1',
            resultsPerPage: '10',
            sort: 'createdAt',
            sortDirection: 'desc',
            receiverUserId: '123',
            propertyId: '456',
            status: 'archived',
          },
        },
      };
      const next = sinon.stub();

      await validateMessageSearch(ctx, next);

      t.true(next.called);
    });

test(`validateMessageSearch() with no parameters calls next`,
    async (t) => {
      const ctx = {
        request: {
          query: {},
        },
      };
      const next = sinon.stub();

      await validateMessageSearch(ctx, next);

      t.true(next.called);
    });
