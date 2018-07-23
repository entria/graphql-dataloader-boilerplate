// @flow

import 'idempotent-babel-polyfill'

import { graphqlPort } from './common/config'
import { startServer } from './common/server'

startServer(graphqlPort)
