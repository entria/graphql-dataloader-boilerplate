// @flow
import { GraphQLString, GraphQLNonNull } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'

import { User } from '../model'
import { generateToken } from '../common/auth'

export default mutationWithClientMutationId({
  name: 'LoginEmail',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ email, password }) => {
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return {
        token: null,
        error: 'INVALID_EMAIL_PASSWORD',
      }
    }

    const correctPassword = user.authenticate(password)

    if (!correctPassword) {
      return {
        token: null,
        error: 'INVALID_EMAIL_PASSWORD',
      }
    }

    return {
      token: generateToken(user),
      error: null,
    }
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
})
