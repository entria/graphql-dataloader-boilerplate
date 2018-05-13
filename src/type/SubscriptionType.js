import { GraphQLObjectType } from 'graphql';

import UserAdded from '../subscriptions/UserAdded';

export default new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    UserAdded,
  },
});
