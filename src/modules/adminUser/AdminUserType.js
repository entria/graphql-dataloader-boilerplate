// @flow
import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';
import { globalIdField } from 'graphql-relay';
import type { GraphQLObjectTypeConfig } from 'graphql';
import type { GraphQLContext } from '../../TypeDefinition';

import { NodeInterface } from '../../../graphql/interface/NodeInterface';
import AdminUser from './AdminUserLoader';

export default new GraphQLObjectType(
  ({
    name: 'AdminUser',
    description: 'Represents AdminUser',
    fields: () => ({
      id: globalIdField('AdminUser'),
      name: {
        type: GraphQLString,
        description: '',
        resolve: obj => obj.name,
      },
      password: {
        type: GraphQLString,
        description: '',
        resolve: obj => obj.password,
      },
      email: {
        type: GraphQLString,
        description: '',
        resolve: obj => obj.email,
      },
      active: {
        type: GraphQLBoolean,
        description: '',
        resolve: obj => obj.active,
      },
    }),
    interfaces: () => [NodeInterface],
  }: GraphQLObjectTypeConfig<AdminUser, GraphQLContext>),
);
