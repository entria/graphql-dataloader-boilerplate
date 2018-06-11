// @flow
import DataLoader from 'dataloader';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import type { ConnectionArguments } from 'graphql-relay';

import CommentModel from './CommentModel';
import type { GraphQLContext } from '../../TypeDefinition';

type CommentType = {
  id: string,
  _id: string,
  author: string,
  score: number,
  post: string,
  text: string,
  createdAt: Date,
  updatedAt: Date,
};

export default class Comment {
  id: string;
  _id: string;
  author: string;
  score: number;
  post: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: CommentType) {
    this.id = data.id;
    this._id = data._id;
    this.author = data.author;
    this.score = data.score;
    this.post = data.post;
    this.text = data.text;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export const getLoader = () => new DataLoader(ids => mongooseLoader(CommentModel, ids));

const viewerCanSee = () => true;

export const load = async ({ dataloaders }: GraphQLContext, id: ?string) => {
  if (!id) return null;

  try {
    const data = await dataloaders.CommentLoader.load(id.toString());

    if (!data) return null;

    return viewerCanSee() ? new Comment(data) : null;
  } catch (err) {
    return null;
  }
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: string) => {
  return dataloaders.CommentLoader.clear(id.toString());
};

export const loadComments = async (context: GraphQLContext, args: ConnectionArguments) => {
  // TODO: specify conditions
  const comments = CommentModel.find({});

  return connectionFromMongoCursor({
    cursor: comments,
    context,
    args,
    loader: load,
  });
};
