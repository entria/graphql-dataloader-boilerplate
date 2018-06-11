// @flow
import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { globalIdField } from 'graphql-relay';
import type { GraphQLObjectTypeConfig } from 'graphql';
import type { GraphQLContext } from '../../TypeDefinition';

import { NodeInterface } from '../../../graphql/interface/NodeInterface';
import UserType from '../user/UserType';
import * as UserLoader from '../user/UserLoader';
import Post from './PostLoader';

export default new GraphQLObjectType(
  ({
    name: 'Post',
    description: 'Represents Post',
    fields: () => ({
      id: globalIdField('Post'),
      title: {
        type: GraphQLString,
        description: '',
        resolve: obj => obj.title,
      },
      author: {
        type: UserType,
        description: 'User that created this post',
        resolve: async (obj, args, context) => await UserLoader.load(context, obj.author),
      },
      slug: {
        type: GraphQLString,
        description: 'Used for SEO',
        resolve: obj => obj.slug,
      },
      tags: {
        type: GraphQLList(GraphQLString),
        description: '',
        resolve: obj => obj.tags,
      },
      oldSlugs: {
        type: GraphQLList(GraphQLString),
        description: 'Old slugs used by this post',
        resolve: obj => obj.oldSlugs,
      },
      comments: {
        type: GraphQLList(CommentType),
        description: '',
        resolve: async (obj, args, context) => await CommentLoader.loadCommentsByIds(context, obj.comments),
      },
      externalComments: {
        type: GraphQLList(CommentType),
        description: 'Comments from external source',
        resolve: async (obj, args, context) =>
          await CommentLoader.loadExternalCommentsByIds(context, obj.externalComments),
      },
      createdAt: {
        type: GraphQLString,
        description: '',
        resolve: obj => (obj.createdAt ? obj.createdAt.toISOString() : null),
      },
      updatedAt: {
        type: GraphQLString,
        description: '',
        resolve: obj => (obj.updatedAt ? obj.updatedAt.toISOString() : null),
      },
    }),
    interfaces: () => [NodeInterface],
  }: GraphQLObjectTypeConfig<Post, GraphQLContext>),
);
