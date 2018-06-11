// @flow
import { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import CommentModel from '../CommentModel';

import CommentType from '../CommentType';
import * as CommentLoader from '../CommentLoader';

export default mutationWithClientMutationId({
  name: 'CommentEdit',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
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

    const { id, author, score, post, text } = args;

    // Check if the provided ID is valid
    const comment = await CommentModel.findOne({
      _id: fromGlobalId(id).id,
    });

    // If not, throw an error
    if (!comment) {
      throw new Error('Invalid commentId');
    }

    // Edit record
    await comment.update({
      author,
      score,
      post,
      text,
    });

    // TODO: mutation logic

    // Clear dataloader cache
    CommentLoader.clearCache(context, comment._id);

    return {
      id: comment._id,
      error: null,
    };
  },
  outputFields: {
    comment: {
      type: CommentType,
      resolve: (obj, args, context) => CommentLoader.load(context, obj.id),
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
