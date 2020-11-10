import test from 'ava';
import sinon from 'sinon';
import {
  validateUser,
  validateUserUpdate,
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
