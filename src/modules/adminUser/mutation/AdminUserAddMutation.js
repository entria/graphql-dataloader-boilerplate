// @flow
import { GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import AdminUserModel from '../AdminUserModel';

import * as AdminUserLoader from '../AdminUserLoader';
import AdminUserConnection from '../AdminUserConnection';

export default mutationWithClientMutationId({
  name: 'AdminUserAdd',
  inputFields: {
    name: {
      type: GraphQLNonNull(GraphQLString),
    },
    password: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    active: {
      type: GraphQLBoolean,
    },
  },
  mutateAndGetPayload: async (args, context) => {
    // Verify if user is authorized
    if (!context.user) {
      throw new Error('Unauthorized user');
    }

    const { name, password, email, active } = args;

    // Create new record
    const adminUser = await new AdminUserModel({
      name,
      password,
      email,
      active,
    }).save();

    // TODO: mutation logic

    return {
      id: adminUser._id,
      error: null,
    };
  },
  outputFields: {
    adminUserEdge: {
      type: AdminUserConnection.edgeType,
      resolve: async ({ id }, args, context) => {
        // Load new edge from loader
        const adminUser = await AdminUserLoader.load(context, id);

        // Returns null if no node was loaded
        if (!adminUser) {
          return null;
        }

        return {
          cursor: toGlobalId('AdminUser', adminUser._id),
          node: adminUser,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
