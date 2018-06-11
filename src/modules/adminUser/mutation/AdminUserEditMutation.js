// @flow
import { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import AdminUserModel from '../AdminUserModel';

import AdminUserType from '../AdminUserType';
import * as AdminUserLoader from '../AdminUserLoader';

export default mutationWithClientMutationId({
  name: 'AdminUserEdit',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
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

    const { id, name, password, email, active } = args;

    // Check if the provided ID is valid
    const adminUser = await AdminUserModel.findOne({
      _id: fromGlobalId(id).id,
    });

    // If not, throw an error
    if (!adminUser) {
      throw new Error('Invalid adminUserId');
    }

    // Edit record
    await adminUser.update({
      name,
      password,
      email,
      active,
    });

    // TODO: mutation logic

    // Clear dataloader cache
    AdminUserLoader.clearCache(context, adminUser._id);

    return {
      id: adminUser._id,
      error: null,
    };
  },
  outputFields: {
    adminUser: {
      type: AdminUserType,
      resolve: (obj, args, context) => AdminUserLoader.load(context, obj.id),
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
