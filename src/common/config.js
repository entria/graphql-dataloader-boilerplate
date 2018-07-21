// @flow

import path from 'path'
import dotenvSafe from 'dotenv-safe'
import * as loaders from '../loader'
import { PubSub } from 'graphql-yoga'
export const pubsub = new PubSub()
// import { RedisPubSub } from 'graphql-redis-subscriptions'

// export const pubsub = new RedisPubSub({
//   connection: {
//     host: '127.0.0.1',
//     port: 6379,
//     retry_strategy: options => {
//       // reconnect after
//       return Math.max(options.attempt * 100, 3000)
//     },
//   },
// })

const root = path.join.bind(this, __dirname, '../../')

dotenvSafe.load({
  path: root('.env'),
  sample: root('.env.example'),
})

// Database Settings
const dBdevelopment = process.env.MONGO_URL || 'mongodb://localhost/database'
const dBproduction = process.env.MONGO_URL || 'mongodb://localhost/database'

// Test Database Settings
// const test = 'mongodb://localhost/awesome-test';

// Export DB Settings
export const databaseConfig =
  process.env.NODE_ENV === 'production' ? dBproduction : dBdevelopment

// Export GraphQL Server settings
export const graphqlPort = process.env.GRAPHQL_PORT || 5000
export const jwtSecret =
  process.env.JWT_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6dwadatwti788DuiODUxMyIsImlhdCI6MTUwMzY5MTE0Mn0.s9kO0HoPZpskzNsstF7Eer504DUC5r1MY6qjSFu_8eM'
export const BASE_URI =
  process.env.BASE_URI || `http://localhost:${graphqlPort}`

// WS
export const WS_BASE_URI =
  process.env.WS_BAS_URI || BASE_URI.replace(/^https?/, 'ws')
// Slack
export const slackWebhook = process.env.SLACK_WEBHOOK

export const dataloaders = Object.keys(loaders).reduce(
  (dataloaders, loaderKey) => ({
    ...dataloaders,
    [loaderKey]: loaders[loaderKey].getLoader(),
  }),
  {}
)
