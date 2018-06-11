// @flow
import { connectionDefinitions } from '../../graphql/connection/CustomConnectionType';

import PostType from './PostType';

export default connectionDefinitions({
  name: 'Post',
  nodeType: PostType,
});
