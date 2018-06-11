// @flow
import { connectionDefinitions } from '../../graphql/connection/CustomConnectionType';

import CommentType from './CommentType';

export default connectionDefinitions({
  name: 'Comment',
  nodeType: CommentType,
});
