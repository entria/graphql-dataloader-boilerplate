import { graphql } from 'graphql';
import { schema } from '../../../../graphql/schema';
import { getContext, connectMongoose, clearDbAndRestartCounters, disconnectMongoose } from '../../../../../test/helper';

import { User, Comment } from '../../../../models';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should not allow anonymous user', async () => {
  //language=GraphQL
  const query = `
    mutation M {
      CommentAdd(input: {
        author: "Example value"
        score: "Example value"
        post: "Example value"
        text: "Example value"
      }) {
        commentEdge {
          node {
            author
            score
            post
            text
          }
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

it('should create a record on database', async () => {
  const user = new User({
    name: 'user',
    email: 'user@example.com',
  });

  await user.save();

  //language=GraphQL
  const query = `
    mutation M {
      CommentAdd(input: {
        author: "Example value"
        score: "Example value"
        post: "Example value"
        text: "Example value"
      }) {
        commentEdge {
          node {
            author
            score
            post
            text
          }
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
