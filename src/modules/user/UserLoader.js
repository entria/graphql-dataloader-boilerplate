// @flow
import DataLoader from 'dataloader'
import { User as UserModel } from '../../model/index'
import {
  connectionFromMongoCursor,
  mongooseLoader,
} from '@entria/graphql-mongoose-loader'

import type { ConnectionArguments } from 'graphql-relay'
import type { GraphQLContext } from '../../TypeDefinition'

type UserType = {
  id: string,
  _id: string,
  name: string,
  password: string,
  email: string,
  active: boolean,
}

export default class User {
  id: string
  _id: string
  name: string
  email: string
  active: boolean

  constructor(data: UserType, { user }: GraphQLContext) {
    this.id = data.id
    this._id = data._id
    this.name = data.name

    // you can only see your own email, and your active status
    if (user && user._id.equals(data._id)) {
      this.email = data.email
      this.active = data.active
    }
  }
}

export const getLoader = () =>
  new DataLoader(ids => mongooseLoader(UserModel, ids))

const viewerCanSee = (context, data) => {
  // Anyone can see another user
  return true
}

export const load = async (
  context: GraphQLContext,
  id: string
): Promise<?User> => {
  if (!id) {
    return null
  }

  let data
  try {
    data = await context.dataloaders.UserLoader.load(id)
  } catch (err) {
    return null
  }
  return viewerCanSee(context, data) ? new User(data, context) : null
}

export const clearCache = ({ dataloaders }: GraphQLContext, id: string) => {
  return dataloaders.UserLoader.clear(id.toString())
}

export const loadUsers = async (
  context: GraphQLContext,
  args: ConnectionArguments
) => {
  const where = args.search
    ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {}
  const users = UserModel.find(where, { _id: 1 }).sort({ createdAt: -1 })

  return connectionFromMongoCursor({
    cursor: users,
    context,
    args,
    loader: load,
  })
}
