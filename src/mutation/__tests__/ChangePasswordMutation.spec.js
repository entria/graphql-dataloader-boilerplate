import { graphql } from 'graphql';

import { schema } from '../../schema';
import { User } from '../../model';
import { getContext, setupTest } from '../../../test/helper';

beforeEach(async () => setupTest());

it('should not change password of non authorized user', async () => {
  // language=GraphQL
  const query = `
    mutation M {
      ChangePassword(input: {
        clientMutationId: "abc"
        oldPassword: "old"
        password: "new"
      }) {
        clientMutationId
        error
      }
    }
  `;

  const rootValue = {};
  const context = getContext();

  const result = await graphql(schema, query, rootValue, context);
  const { errors } = result;

  expect(errors.length).toBe(1);
  expect(errors[0].message).toBe('invalid user');
});

it('should not change password if oldPassword is invalid', async () => {
  const user = new User({
    name: 'user',
    email: 'awesome@example.com',
    password: 'awesome',
  });
  await user.save();

  // language=GraphQL
  const query = `
    mutation M {
      ChangePassword(input: {
        clientMutationId: "abc"
        oldPassword: "old"
        password: "new"
      }) {
        clientMutationId
        error
      }
    }
  `;

  const rootValue = {};
  const context = getContext({ user });

  const result = await graphql(schema, query, rootValue, context);
  const { ChangePassword } = result.data;

  expect(ChangePassword.error).toBe('INVALID_PASSWORD');
});

it('should change password if oldPassword is correct', async () => {
  const password = 'awesome';

  const user = new User({
    name: 'user',
    email: 'awesome@example.com',
    password,
  });
  await user.save();

  // language=GraphQL
  const query = `
    mutation M {
      ChangePassword(input: {
        clientMutationId: "abc"
        oldPassword: "${password}"
        password: "new"
      }) {
        clientMutationId
        error
      }
    }
  `;

  const rootValue = {};
  const context = getContext({ user });

  const result = await graphql(schema, query, rootValue, context);
  const { ChangePassword } = result.data;

  expect(ChangePassword.error).toBe(null);
});
