// @flow

import { GraphQLSchema } from 'graphql';

import QueryType from './type/QueryType';
import MutationType from './type/MutationType';
import SubscriptionType from './type/SubscriptionType';

export default new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  subscription: SubscriptionType,
});
