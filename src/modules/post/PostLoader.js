// @flow
import DataLoader from 'dataloader';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import type { ConnectionArguments } from 'graphql-relay';

import PostModel from './PostModel';
import type { GraphQLContext } from '../../TypeDefinition';

type PostType = {
  id: string,
  _id: string,
  title: string,
  author: string,
  slug: string,
  tags: string[],
  oldSlugs: string[],
  comments: string[],
  externalComments: string[],
  createdAt: Date,
  updatedAt: Date,
};

export default class Post {
  id: string;
  _id: string;
  title: string;
  author: string;
  slug: string;
  tags: string[];
  oldSlugs: string[];
  comments: string[];
  externalComments: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: PostType) {
    this.id = data.id;
    this._id = data._id;
    this.title = data.title;
    this.author = data.author;
    this.slug = data.slug;
    this.tags = data.tags;
    this.oldSlugs = data.oldSlugs;
    this.comments = data.comments;
    this.externalComments = data.externalComments;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export const getLoader = () => new DataLoader(ids => mongooseLoader(PostModel, ids));

const viewerCanSee = () => true;

export const load = async ({ dataloaders }: GraphQLContext, id: ?string) => {
  if (!id) return null;

  try {
    const data = await dataloaders.PostLoader.load(id.toString());

    if (!data) return null;

    return viewerCanSee() ? new Post(data) : null;
  } catch (err) {
    return null;
  }
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: string) => {
  return dataloaders.PostLoader.clear(id.toString());
};

export const loadPosts = async (context: GraphQLContext, args: ConnectionArguments) => {
  // TODO: specify conditions
  const posts = PostModel.find({});

  return connectionFromMongoCursor({
    cursor: posts,
    context,
    args,
    loader: load,
  });
};
