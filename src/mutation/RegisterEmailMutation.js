// @flow
import { GraphQLString, GraphQLNonNull } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { User } from '../model'
import { generateToken } from '../common/auth'
import { EVENTS, ERRORS } from '../common/consts'
import { pubsub } from '../common/config'

export default mutationWithClientMutationId({
  name: 'RegisterEmail',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ name, email, password }) => {
    const hasUser = await User.findOne({ email: email.toLowerCase() })

    if (hasUser) {
      return {
        token: null,
        error: ERRORS.emailAlreadyInUse,
      }
    }

    const user = new User({
      name,
      email,
      password,
    })
    await user.save()

    await pubsub.publish(EVENTS.user.added, user)

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
