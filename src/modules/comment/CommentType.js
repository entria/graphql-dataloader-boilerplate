// @flow
import { GraphQLObjectType, GraphQLInt, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';
import type { GraphQLObjectTypeConfig } from 'graphql';
import type { GraphQLContext } from '../../TypeDefinition';

import { NodeInterface } from '../../../graphql/interface/NodeInterface';
import UserType from '../user/UserType';
import * as UserLoader from '../user/UserLoader';
import PostType from '../post/PostType';
import * as PostLoader from '../post/PostLoader';
import Comment from './CommentLoader';

export default new GraphQLObjectType(
  ({
    name: 'Comment',
    description: 'Represents Comment',
    fields: () => ({
      id: globalIdField('Comment'),
      author: {
        type: UserType,
        description: 'User that created this comment',
        resolve: async (obj, args, context) => await UserLoader.load(context, obj.author),
      },
      score: {
        type: GraphQLInt,
        description: 'Sum of all upvotes/downvotes this comment has',
        resolve: obj => obj.score,
      },
      post: {
        type: PostType,
        description: 'post of this comment',
        resolve: async (obj, args, context) => await PostLoader.load(context, obj.post),
      },
      text: {
        type: GraphQLString,
        description: '',
        resolve: obj => obj.text,
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
  }: GraphQLObjectTypeConfig<Comment, GraphQLContext>),
);
