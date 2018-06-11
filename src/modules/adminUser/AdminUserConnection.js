// @flow
import { connectionDefinitions } from '../../graphql/connection/CustomConnectionType';

import AdminUserType from './AdminUserType';

export default connectionDefinitions({
  name: 'AdminUser',
  nodeType: AdminUserType,
});
