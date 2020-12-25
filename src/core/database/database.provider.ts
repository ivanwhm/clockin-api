import * as mongoose from 'mongoose';

import { config } from '../config';
import { MONGODB_CONNECTION } from '../constants';

export const databaseProviders = [
  {
    provide: MONGODB_CONNECTION,
    useFactory: async (): Promise<typeof mongoose> => {
      let auth = '';
      if (config.database.user && config.database.password) {
        auth = `${config.database.user}:${config.database.password}@`;
      }

      const connectionString = `${config.database.type}://${auth}${config.database.host}:${config.database.port}/${config.database.name}`;

      return mongoose.connect(connectionString, {
        useNewUrlParser: config.database.useNewUrlParser,
        useUnifiedTopology: config.database.useUnifiedTopology,
        useCreateIndex: config.database.useCreateIndex,
        useFindAndModify: config.database.useFindAndModify,
      });
    },
  },
];
