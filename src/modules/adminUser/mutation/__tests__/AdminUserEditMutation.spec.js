import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import { schema } from '../../../../graphql/schema';
import { getContext, connectMongoose, clearDbAndRestartCounters, disconnectMongoose } from '../../../../../test/helper';

import { User, AdminUser } from '../../../../models';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should not allow anonymous user', async () => {
  // TODO: specify fields to create a new AdminUser
  const adminUser = new AdminUser({
    name: 'Example value',
    password: 'Example value',
    email: 'Example value',
    active: 'Example value',
  });

  await adminUser.save();

  const adminUserId = toGlobalId('AdminUser', adminUser._id);

  //language=GraphQL
  const query = `
    mutation M {
      AdminUserEdit(input: {
        id: "${adminUserId}"
        example: "Example Field to Update"
      }) {
        adminUser {
          name
          password
          email
          active
        }
      }
    }
  `;

  const variables = {};
  const rootValue = {};
  const context = getContext();

  const result = await graphql(schema, query, rootValue, context, variables);

  expect(result).toMatchSnapshot();
});

it('should edit a record on database', async () => {
  const user = new User({
    name: 'user',
    email: 'user@example.com',
  });

  await user.save();

  // TODO: specify fields to create a new AdminUser
  const adminUser = new AdminUser({
    name: 'Example value',
    password: 'Example value',
    email: 'Example value',
    active: 'Example value',
  });

  await adminUser.save();

  const adminUserId = toGlobalId('AdminUser', adminUser._id);

  //language=GraphQL
  const query = `
    mutation M {
      AdminUserEdit(input: {
        id: "${adminUserId}"
        example: "Example Field to Update"
      }) {
        adminUser {
          name
          password
          email
          active
        }
      }
    }
  `;

  const variables = {};
  const rootValue = {};
  const context = getContext({ user });

  const result = await graphql(schema, query, rootValue, context, variables);

  expect(result).toMatchSnapshot();
});
