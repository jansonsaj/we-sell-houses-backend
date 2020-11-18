import test from 'ava';
import sinon from 'sinon';
import Property from '../../models/property.js';
import User from '../../models/user.js';

/**
 * A sample user to be used for testing
 * @return {User} sample user
 */
function sampleProperty() {
  return new Property({
    title: 'title',
    description: 'description',
    ownerId: '123',
    type: 'flat',
    features: ['has garden'],
    price: 100.00,
  });
}

test('new Property() sets default status "listed"', (t) => {
  t.is(sampleProperty().status, 'listed');
});

test('new Property() sets default priority "normal"', (t) => {
  t.is(sampleProperty().priority, 'normal');
});

test('new Property() stores price as pence', (t) => {
  const storedPrice = sampleProperty().get('price', null, {getters: false});
  t.is(storedPrice, 10000);
});

test('new Property() get price as pounds', (t) => {
  t.is(sampleProperty().price, '100.00');
});

test('new Property() set price as pounds', (t) => {
  const property = sampleProperty();
  property.price = 2;
  t.is(property.price, '2.00');
});

test('getOwner() method invokes User.findById()', async (t) => {
  sinon.stub(User, 'findById')
      .returns({
        exec: () => 'owner',
      });
  const owner = await sampleProperty().getOwner();
  t.deepEqual(owner, 'owner');
});
