// @flow
import { GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import PostModel from '../PostModel';

import * as PostLoader from '../PostLoader';
import PostConnection from '../PostConnection';

export default mutationWithClientMutationId({
  name: 'PostAdd',
  inputFields: {
    title: {
      type: GraphQLNonNull(GraphQLString),
    },
    author: {
      type: GraphQLNonNull(GraphQLID),
    },
    slug: {
      type: GraphQLString,
    },
    tags: {
      type: GraphQLList(GraphQLString),
    },
    oldSlugs: {
      type: GraphQLList(GraphQLString),
    },
    comments: {
      type: GraphQLList(GraphQLID),
    },
    externalComments: {
      type: GraphQLList(GraphQLID),
    },
  },
  mutateAndGetPayload: async (args, context) => {
    // Verify if user is authorized
    if (!context.user) {
      throw new Error('Unauthorized user');
    }

    const { title, author, slug, tags, oldSlugs, comments, externalComments } = args;

    // Create new record
    const post = await new PostModel({
      title,
      author,
      slug,
      tags,
      oldSlugs,
      comments,
      externalComments,
    }).save();

    // TODO: mutation logic

    return {
      id: post._id,
      error: null,
    };
  },
  outputFields: {
    postEdge: {
      type: PostConnection.edgeType,
      resolve: async ({ id }, args, context) => {
        // Load new edge from loader
        const post = await PostLoader.load(context, id);

        // Returns null if no node was loaded
        if (!post) {
          return null;
        }

        return {
          cursor: toGlobalId('Post', post._id),
          node: post,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
