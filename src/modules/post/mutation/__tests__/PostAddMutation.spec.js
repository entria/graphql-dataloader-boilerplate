import { graphql } from 'graphql';
import { schema } from '../../../../graphql/schema';
import { getContext, connectMongoose, clearDbAndRestartCounters, disconnectMongoose } from '../../../../../test/helper';

import { User, Post } from '../../../../models';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should not allow anonymous user', async () => {
  //language=GraphQL
  const query = `
    mutation M {
      PostAdd(input: {
        title: "Example value"
        author: "Example value"
        slug: "Example value"
        tags: "Example value"
        oldSlugs: "Example value"
        comments: "Example value"
        externalComments: "Example value"
      }) {
        postEdge {
          node {
            title
            author
            slug
            tags
            oldSlugs
            comments
            externalComments
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
      PostAdd(input: {
        title: "Example value"
        author: "Example value"
        slug: "Example value"
        tags: "Example value"
        oldSlugs: "Example value"
        comments: "Example value"
        externalComments: "Example value"
      }) {
        postEdge {
          node {
            title
            author
            slug
            tags
            oldSlugs
            comments
            externalComments
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
