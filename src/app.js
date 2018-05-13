// @flow
import 'isomorphic-fetch';

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import graphqlHttp from 'koa-graphql';
import graphqlBatchHttpWrapper from 'koa-graphql-batch';
import logger from 'koa-logger';
import Router from 'koa-router';
import { graphiqlKoa } from 'apollo-server-koa';

import schema from './schema';
import { jwtSecret, graphqlPort } from './config';
import { getUser } from './auth';
import * as loaders from './loader';

const app = new Koa();
const router = new Router();

app.keys = jwtSecret;

const graphqlSettingsPerReq = async req => {
  console.log('req', req.header.authorization);
  const { user } = await getUser(req.header.authorization);
  console.log('user', user);

  const dataloaders = Object.keys(loaders).reduce(
    (dataloaders, loaderKey) => ({
      ...dataloaders,
      [loaderKey]: loaders[loaderKey].getLoader(),
    }),
    {},
  );

  return {
    graphiql: process.env.NODE_ENV !== 'production',
    schema,
    context: {
      user,
      req,
      dataloaders,
    },
    // extensions: ({ document, variables, operationName, result }) => {
    // console.log(print(document));
    // console.log(variables);
    // console.log(result);
    // },
    formatError: error => {
      console.log(error.message);
      console.log(error.locations);
      console.log(error.stack);

      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack,
      };
    },
  };
};

const graphqlServer = graphqlHttp(graphqlSettingsPerReq);

// graphql batch query route
router.all('/graphql/batch', bodyParser(), graphqlBatchHttpWrapper(graphqlServer));
router.all('/graphql', graphqlServer);
router.all(
  '/graphiql',
  graphiqlKoa({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${graphqlPort}/subscriptions`,
  }),
);

app.use(logger());
app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

export default app;
