import test from 'ava';
import sinon from 'sinon';
import {
  validateUser,
  validateUserCreate,
  validateUserUpdate,
  validateProperty,
} from '../../middlewares/validation.js';

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

test('validateProperty() with valid property calls next', async (t) => {
  const ctx = {
    request: {
      body: {
        title: 'title',
        description: 'description',
        ownerId: '123',
        type: 'flat',
        features: ['has garden'],
        price: 100.00,
      },
    },
  };
  const next = sinon.stub();

  await validateProperty(ctx, next);

  t.true(next.called);
});

['title', 'ownerId', 'type'].forEach((requiredProperty) => {
  test(`validateProperty() without ${requiredProperty} doesn't call next`,
      async (t) => {
        const ctx = {
          request: {
            body: {
              title: 'title',
              description: 'description',
              ownerId: '123',
              type: 'flat',
              features: ['has garden'],
              price: 100.00,
            },
          },
        };
        const next = sinon.stub();

        delete ctx.request.body[requiredProperty];

        await validateProperty(ctx, next);

        t.true(next.notCalled);
      });
});

test('validateProperty() with negative price doesn\'t call next', async (t) => {
  const ctx = {
    request: {
      body: {
        title: 'title',
        description: 'description',
        ownerId: '123',
        type: 'flat',
        features: ['has garden'],
        price: -100.00,
      },
    },
  };
  const next = sinon.stub();

  await validateProperty(ctx, next);

  t.is(ctx.status, 400);
  t.is(ctx.body.message, 'must be greater than or equal to 0');
  t.true(next.notCalled);
});

test('validateProperty() with incomplete location doesn\'t call next',
    async (t) => {
      const ctx = {
        request: {
          body: {
            title: 'title',
            description: 'description',
            ownerId: '123',
            type: 'flat',
            features: ['has garden'],
            price: 100.00,
            location: {
              postcode: 'AB12 3CD',
            },
          },
        },
      };
      const next = sinon.stub();

      await validateProperty(ctx, next);

      t.is(ctx.status, 400);
      t.is(ctx.body.message, 'requires property "addressLine1"');
      t.true(next.notCalled);
    });
