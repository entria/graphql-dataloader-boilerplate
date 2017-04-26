// @flow

import { GraphQLObjectType } from 'graphql';
import { NodeField } from '../interface/NodeInterface';

import { ViewerLoader } from '../loader';
import { ViewerType } from './';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: NodeField,
    viewer: {
      type: ViewerType,
      args: {},
      resolve: async (obj, args, { user }) =>
         await ViewerLoader.load(user ? user._id : null)
      ,
    },
  }),
});
