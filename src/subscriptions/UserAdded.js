import { toGlobalId } from 'graphql-relay'

import { EVENTS } from '../common/consts'
import UserConnection from '../modules/user/UserConnection'
import { UserLoader } from '../loader'
import { pubsub } from '../common/config'

const userAdded = {
  type: UserConnection.edgeType,
  resolve: async (tattoo, args, context) => {
    const userAdded = await UserLoader.load(context, tattoo._id)
    // Returns null if no node was loaded
    if (!userAdded) {
      return {
        error: ERRORS.nodeNotFound,
      }
    }

    return {
      cursor: toGlobalId('User', userAdded),
      node: userAdded,
    }
  },

  subscribe: () => pubsub.asyncIterator(EVENTS.user.added),
}

export default userAdded
