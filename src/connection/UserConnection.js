// @flow

import {
  GraphQLInt,
} from 'graphql';

import {
  connectionDefinitions,
} from 'graphql-relay';

import { UserType } from '../type';

export default connectionDefinitions({
  name: 'User',
  nodeType: UserType,
  connectionFields: {
    count: {
      type: GraphQLInt,
    },
  },
});
