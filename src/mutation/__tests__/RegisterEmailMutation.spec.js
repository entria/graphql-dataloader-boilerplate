import { graphql } from 'graphql'

import { User } from '../../model'
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

it('should not register with an existing email', async () => {
  const user = await createRows.createUser()

  // language=GraphQL
  const query = `
    mutation M {
      RegisterEmail(input: {
        clientMutationId: "abc"
        name: "Awesome"
        email: "${user.email}"
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
  const { RegisterEmail } = result.data

  expect(RegisterEmail.token).toBe(null)
  expect(RegisterEmail.error).toBe('EMAIL_ALREADY_IN_USE')
})

it('should create a new user when parameters are valid', async () => {
  const email = 'awesome@example.com'

  // language=GraphQL
  const query = `
    mutation M {
      RegisterEmail(input: {
        clientMutationId: "abc"
        name: "Awesome"
        email: "${email}"
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
  const { RegisterEmail } = result.data

  const user = await User.findOne({
    email,
  })

  expect(user).not.toBe(null)
  expect(RegisterEmail.token).toBe(generateToken(user))
  expect(RegisterEmail.error).toBe(null)
})
