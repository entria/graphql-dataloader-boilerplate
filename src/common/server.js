// @flow
import { GraphQLServer } from 'graphql-yoga'

import { connectDatabase } from './database'
import { schema } from '../schema'
import { BASE_URI, dataloaders, jwtSecret, pubsub } from './config'
import { getUser } from './auth'

export const startServer = async (connectionPort: string | number) => {
  try {
    const info = await connectDatabase()
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`)
  } catch (error) {
    console.error('Unable to connect to database')
    process.exit(1)
  }

  const context = async ctx => {
    const hasRequest = 'request' in ctx
    const token = hasRequest ? ctx.request.headers.authorization : null

    const { user } = await getUser(token)

    return {
      dataloaders,
      user,
      pubsub,
      // models
    }
  }

  const server = new GraphQLServer({
    schema,
    context,
  })

  server.keys = jwtSecret

  const options = {
    port: connectionPort,
    cacheControl: true,
    deduplicator: true,
    endpoint: '/graphql',
    playground: '/graphql',
    subscriptions: '/graphql',
  }

  server.start(options, () =>
    console.log(`GraphQL Server is now running on ${BASE_URI}`)
  )
}
