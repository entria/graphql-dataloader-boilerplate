import { graphql } from 'graphql';
import { schema } from '../../../graphql/schema';
import { getContext, connectMongoose, clearDbAndRestartCounters, disconnectMongoose } from '../../../../test/helper';
import { User, AdminUser } from '../../../models';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should retrieve a record', async () => {
  const user = await new User({
    name: 'user',
    email: 'user@example.com',
  }).save();

  // TODO: query to return a record
  const query = `
    query Q {
      node(id:"123") {
        id
      }
    }
  `;

  const variables = {};
  const rootValue = {};
  const context = getContext({ user });

  const { errors, data } = await graphql(schema, query, rootValue, context, variables);

  expect(data.node).toBe(null);
  expect(errors).toBe(undefined);
});
