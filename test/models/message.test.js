import test from 'ava';
import sinon from 'sinon';
import Message from '../../models/message.js';
import Property from '../../models/property.js';
import User from '../../models/user.js';

/**
 * A sample user to be used for testing
 * @return {User} sample user
 */
function sampleMessage() {
  const message = new Message({
    body: 'message body',
    senderEmail: 'email@email.com',
    senderPhone: '12345678',
  });
  sinon.stub(message, 'receiverUserId').get(() => '123');
  sinon.stub(message, 'propertyId').get(() => '456');
  return message;
}

test('new Property() sets default status "sent"', (t) => {
  t.is(sampleMessage().status, 'sent');
});

test('getReceiverUser() method invokes User.findById()', async (t) => {
  sinon.stub(User, 'findById')
      .callsFake((userId) => {
        t.is(userId, '123');
        return {exec: () => 'receiverUser'};
      });
  const owner = await sampleMessage().getReceiverUser();
  t.deepEqual(owner, 'receiverUser');
});

test('getProperty() method invokes Property.findById()', async (t) => {
  sinon.stub(Property, 'findById')
      .callsFake((propertyId) => {
        t.is(propertyId, '456');
        return {exec: () => 'property'};
      });
  const owner = await sampleMessage().getProperty();
  t.deepEqual(owner, 'property');
});
