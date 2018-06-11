import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import { schema } from '../../../../graphql/schema';
import { getContext, connectMongoose, clearDbAndRestartCounters, disconnectMongoose } from '../../../../../test/helper';

import { User, Comment } from '../../../../models';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should not allow anonymous user', async () => {
  // TODO: specify fields to create a new Comment
  const comment = new Comment({
    author: 'Example value',
    score: 'Example value',
    post: 'Example value',
    text: 'Example value',
  });

  await comment.save();

  const commentId = toGlobalId('Comment', comment._id);

  //language=GraphQL
  const query = `
    mutation M {
      CommentEdit(input: {
        id: "${commentId}"
        example: "Example Field to Update"
      }) {
        comment {
          author
          score
          post
          text
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

  // TODO: specify fields to create a new Comment
  const comment = new Comment({
    author: 'Example value',
    score: 'Example value',
    post: 'Example value',
    text: 'Example value',
  });

  await comment.save();

  const commentId = toGlobalId('Comment', comment._id);

  //language=GraphQL
  const query = `
    mutation M {
      CommentEdit(input: {
        id: "${commentId}"
        example: "Example Field to Update"
      }) {
        comment {
          author
          score
          post
          text
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
