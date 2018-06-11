// @flow
import DataLoader from 'dataloader';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import type { ConnectionArguments } from 'graphql-relay';

import AdminUserModel from './AdminUserModel';
import type { GraphQLContext } from '../../TypeDefinition';

type AdminUserType = {
  id: string,
  _id: string,
  name: string,
  password: string,
  email: string,
  active: boolean,
};

export default class AdminUser {
  id: string;
  _id: string;
  name: string;
  password: string;
  email: string;
  active: boolean;

  constructor(data: AdminUserType) {
    this.id = data.id;
    this._id = data._id;
    this.name = data.name;
    this.password = data.password;
    this.email = data.email;
    this.active = data.active;
  }
}

export const getLoader = () => new DataLoader(ids => mongooseLoader(AdminUserModel, ids));

const viewerCanSee = () => true;

export const load = async ({ dataloaders }: GraphQLContext, id: ?string) => {
  if (!id) return null;

  try {
    const data = await dataloaders.AdminUserLoader.load(id.toString());

    if (!data) return null;

    return viewerCanSee() ? new AdminUser(data) : null;
  } catch (err) {
    return null;
  }
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: string) => {
  return dataloaders.AdminUserLoader.clear(id.toString());
};

export const loadAdminUsers = async (context: GraphQLContext, args: ConnectionArguments) => {
  // TODO: specify conditions
  const adminUsers = AdminUserModel.find({});

  return connectionFromMongoCursor({
    cursor: adminUsers,
    context,
    args,
    loader: load,
  });
};
