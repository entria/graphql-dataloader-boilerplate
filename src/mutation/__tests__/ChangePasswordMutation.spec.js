import { graphql } from 'graphql'

import { schema } from '../../schema'
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
  `

  const rootValue = {}
  const context = getContext()

  const result = await graphql(schema, query, rootValue, context)
  const { errors } = result

  expect(errors.length).toBe(1)
  expect(errors[0].message).toBe('invalid user')
})

it('should not change password if oldPassword is invalid', async () => {
  const user = await createRows.createUser()

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
  `

  const rootValue = {}
  const context = getContext({ user })

  const result = await graphql(schema, query, rootValue, context)
  const { ChangePassword } = result.data

  expect(ChangePassword.error).toBe('INVALID_PASSWORD')
})

it('should change password if oldPassword is correct', async () => {
  const password = 'awesome'
  const user = await createRows.createUser({ password })

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
  `

  const rootValue = {}
  const context = getContext({ user })

  const result = await graphql(schema, query, rootValue, context)
  const { ChangePassword } = result.data

  expect(ChangePassword.error).toBe(null)
})
