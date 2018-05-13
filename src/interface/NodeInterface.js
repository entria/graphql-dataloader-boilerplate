// @flow

import { nodeDefinitions, fromGlobalId } from 'graphql-relay';

import User from '../loader/UserLoader';
import { UserLoader } from '../loader';
import UserType from '../type/UserType';

const { nodeField, nodeInterface } = nodeDefinitions(
  // A method that maps from a global id to an object
  async (globalId, context) => {
    const { id, type } = fromGlobalId(globalId);

    // console.log('id, type: ', type, id, globalId);
    if (type === 'User') {
      const userLoader = UserLoader.load(context, id);
      return userLoader;
    }

    return undefined;
  },
  // A method that maps from an object to a type
  obj => {
    // console.log('obj: ', typeof obj, obj.constructor);
    if (obj instanceof User) {
      return UserType;
    }

    return undefined;
  },
);

export const NodeInterface = nodeInterface;
export const NodeField = nodeField;
