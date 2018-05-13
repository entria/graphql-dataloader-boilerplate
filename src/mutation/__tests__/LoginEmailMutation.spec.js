import { graphql } from 'graphql';

import { schema } from '../../schema';
import { User } from '../../model';
import { generateToken } from '../../auth';
import { getContext, setupTest } from '../../../test/helper';

beforeEach(async () => setupTest());

it('should not login if email is not in the database', async () => {
  // language=GraphQL
  const query = `
    mutation M {
      LoginEmail(input: {
        clientMutationId: "abc"
        email: "awesome@example.com"
        password: "awesome"
      }) {
        clientMutationId
        token
        error
      }     
    }
  `;

  const rootValue = {};
  const context = getContext();

  const result = await graphql(schema, query, rootValue, context);
  const { LoginEmail } = result.data;

  expect(LoginEmail.token).toBe(null);
  expect(LoginEmail.error).toBe('INVALID_EMAIL_PASSWORD');
});

it('should not login with wrong email', async () => {
  const user = new User({
    name: 'user',
    email: 'awesome@example.com',
    password: 'awesome',
  });
  await user.save();

  // language=GraphQL
  const query = `
    mutation M {
      LoginEmail(input: {
        clientMutationId: "abc"
        email: "awesome@example.com"
        password: "notawesome"
      }) {
        clientMutationId
        token
        error
      }     
    }
  `;

  const rootValue = {};
  const context = getContext();

  const result = await graphql(schema, query, rootValue, context);
  const { LoginEmail } = result.data;

  expect(LoginEmail.token).toBe(null);
  expect(LoginEmail.error).toBe('INVALID_EMAIL_PASSWORD');
});

it('should generate token when email and password is correct', async () => {
  const email = 'awesome@example.com';
  const password = 'awesome';

  const user = new User({
    name: 'user',
    email,
    password,
  });
  await user.save();

  // language=GraphQL
  const query = `
    mutation M {
      LoginEmail(input: {
        clientMutationId: "abc"
        email: "${email}"
        password: "${password}"
      }) {
        clientMutationId
        token
        error
      }     
    }
  `;

  const rootValue = {};
  const context = getContext();

  const result = await graphql(schema, query, rootValue, context);
  const { LoginEmail } = result.data;

  expect(LoginEmail.token).toBe(generateToken(user));
  expect(LoginEmail.error).toBe(null);
});
