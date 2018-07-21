/* @flow */
import type Dataloader from 'dataloader'

type Key = string

export type Dataloaders = {
  UserLoader: Dataloader<Key, *>,
}

export type GraphQLContext = {
  user?: Object,
  dataloaders: Dataloaders,
}
