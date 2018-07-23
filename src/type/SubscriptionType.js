// external imports
import { GraphQLObjectType } from 'graphql'
// local imports
import UserAdded from '../subscriptions/UserAdded'

export default new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    UserAdded,
  },
})
