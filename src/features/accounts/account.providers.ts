import { Connection } from 'mongoose';
import { ACCOUNT_MODEL, MONGODB_CONNECTION, USER_SCHEMA_NAME } from 'src/core';

import { AccountSchema } from './schemas';

export const providers = [
  {
    provide: ACCOUNT_MODEL,
    useFactory: (conn: Connection) => conn.model(USER_SCHEMA_NAME, AccountSchema),
    inject: [MONGODB_CONNECTION],
  },
];
