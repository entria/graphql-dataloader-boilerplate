// @flow
import { GraphQLString, GraphQLID, GraphQLInt, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import CommentModel from '../CommentModel';

import * as CommentLoader from '../CommentLoader';
import CommentConnection from '../CommentConnection';

export default mutationWithClientMutationId({
  name: 'CommentAdd',
  inputFields: {
    author: {
      type: GraphQLNonNull(GraphQLID),
    },
    score: {
      type: GraphQLInt,
    },
    post: {
      type: GraphQLNonNull(GraphQLID),
    },
    text: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args, context) => {
    // Verify if user is authorized
    if (!context.user) {
      throw new Error('Unauthorized user');
    }

    const { author, score, post, text } = args;

    // Create new record
    const comment = await new CommentModel({
      author,
      score,
      post,
      text,
    }).save();

    // TODO: mutation logic

    return {
      id: comment._id,
      error: null,
    };
  },
  outputFields: {
    commentEdge: {
      type: CommentConnection.edgeType,
      resolve: async ({ id }, args, context) => {
        // Load new edge from loader
        const comment = await CommentLoader.load(context, id);

        // Returns null if no node was loaded
        if (!comment) {
          return null;
        }

        return {
          cursor: toGlobalId('Comment', comment._id),
          node: comment,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
