import { graphql } from 'graphql'

import { schema } from '../../schema'
import { generateToken } from '../../common/auth'
import {
  getContext,
  connectMongoose,
  clearDbAndRestartCounters,
  disconnectMongoose,
  createRows,
} from '../../../test/helper'

beforeAll(connectMongoose)

beforeEach(clearDbAndRestartCounters)

afterAll(disconnectMongoose)

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
  `

  const rootValue = {}
  const context = getContext()

  const result = await graphql(schema, query, rootValue, context)
  const { LoginEmail } = result.data

  expect(LoginEmail.token).toBe(null)
  expect(LoginEmail.error).toBe('INVALID_EMAIL_PASSWORD')
})

it('should not login with wrong password', async () => {
  const user = await createRows.createUser()

  // language=GraphQL
  const query = `
    mutation M {
      LoginEmail(input: {
        clientMutationId: "abc"
        email: "${user.email}"
        password: "notawesome"
      }) {
        clientMutationId
        token
        error
      }     
    }
  `

  const rootValue = {}
  const context = getContext()

  const result = await graphql(schema, query, rootValue, context)
  const { LoginEmail } = result.data

  expect(LoginEmail.token).toBe(null)
  expect(LoginEmail.error).toBe('INVALID_EMAIL_PASSWORD')
})

it('should generate token when email and password is correct', async () => {
  const password = 'awesome'
  const user = await createRows.createUser({ password })

  // language=GraphQL
  const query = `
    mutation M {
      LoginEmail(input: {
        clientMutationId: "abc"
        email: "${user.email}"
        password: "${password}"
      }) {
        clientMutationId
        token
        error
      }     
    }
  `

  const rootValue = {}
  const context = getContext()

  const result = await graphql(schema, query, rootValue, context)
  const { LoginEmail } = result.data

  expect(LoginEmail.token).toBe(generateToken(user))
  expect(LoginEmail.error).toBe(null)
})
