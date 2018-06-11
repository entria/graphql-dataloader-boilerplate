// @flow
import { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLList } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import PostModel from '../PostModel';

import PostType from '../PostType';
import * as PostLoader from '../PostLoader';

export default mutationWithClientMutationId({
  name: 'PostEdit',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
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

    const { id, title, author, slug, tags, oldSlugs, comments, externalComments } = args;

    // Check if the provided ID is valid
    const post = await PostModel.findOne({
      _id: fromGlobalId(id).id,
    });

    // If not, throw an error
    if (!post) {
      throw new Error('Invalid postId');
    }

    // Edit record
    await post.update({
      title,
      author,
      slug,
      tags,
      oldSlugs,
      comments,
      externalComments,
    });

    // TODO: mutation logic

    // Clear dataloader cache
    PostLoader.clearCache(context, post._id);

    return {
      id: post._id,
      error: null,
    };
  },
  outputFields: {
    post: {
      type: PostType,
      resolve: (obj, args, context) => PostLoader.load(context, obj.id),
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
