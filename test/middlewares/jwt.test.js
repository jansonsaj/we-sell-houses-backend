import test from 'ava';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import {verifyToken, extractCallingUser} from '../../middlewares/jwt.js';
import User from '../../models/user.js';

test.afterEach(() => {
  sinon.restore();
});

test('verifyToken() wihout token doesn\'t call next', async (t) => {
  const ctx = {
    get: sinon.stub().returns(null),
  };
  const next = sinon.stub();

  await verifyToken(ctx, next);

  t.is(ctx.status, 400);
  t.is(
      ctx.body,
      'You need to provide an authorization token in x-access-token header',
  );
  t.true(next.notCalled);
});

test('verifyToken() with invalid token doesn\'t call next', async (t) => {
  const ctx = {
    get: sinon.stub().returns('invalid token'),
  };
  const next = sinon.stub();

  await verifyToken(ctx, next);

  t.is(ctx.status, 401);
  t.is(
      ctx.body,
      'Unauthorized. You are trying to access a protected resource',
  );
  t.true(next.notCalled);
});

test('verifyToken() with valid token calls next', async (t) => {
  const verifyStub = sinon.stub(jwt, 'verify').returns({id: 'id'});
  const ctx = {
    get: sinon.stub().returns('valid token'),
    state: {},
  };
  const next = sinon.stub();

  await verifyToken(ctx, next);

  t.is(ctx.state.userId, 'id');
  t.is(verifyStub.firstCall.firstArg, 'valid token');
  t.true(next.called);
});

test.serial('extractCallingUser() when user doesn\'t exist doesn\'t call next',
    async (t) => {
      sinon.stub(User, 'findById').returns({
        exec: () => null,
      });
      const ctx = {
        state: {userId: 'id'},
      };
      const next = sinon.stub();

      await extractCallingUser(ctx, next);

      t.is(ctx.status, 401);
      t.is(
          ctx.body,
          'Unauthorized. You are trying to access a protected resource',
      );
      t.true(next.notCalled);
    },
);

test.serial('extractCallingUser() when throws exception doesn\'t call next',
    async (t) => {
      sinon.stub(User, 'findById').throws('test exception');
      const ctx = {
        state: {userId: 'id'},
      };
      const next = sinon.stub();

      await extractCallingUser(ctx, next);

      t.is(ctx.status, 401);
      t.is(
          ctx.body,
          'Unauthorized. You are trying to access a protected resource',
      );
      t.true(next.notCalled);
    },
);

test.serial('extractCallingUser() stores user in state and calls next',
    async (t) => {
      const userStub = sinon.stub(User, 'findById').returns({
        exec: () => 'user',
      });
      const ctx = {
        state: {userId: 'id'},
      };
      const next = sinon.stub();

      await extractCallingUser(ctx, next);

      t.is(ctx.state.user, 'user');
      t.true(userStub.calledOnceWith('id'));
      t.true(next.called);
    },
);
