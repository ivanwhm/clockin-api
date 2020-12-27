import { Config } from './config';

export const config: Config = {
  app: {
    protocol: process.env.APP_PROTOCOL,
    host: process.env.APP_HOST,
    isProduction: process.env.NODE_ENV === 'production',
    timeZone: process.env.TZ,
  },
  database: {
    type: process.env.DB_TYPE,
    port: parseInt(process.env.DB_PORT, 10),
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_DATABASE,
  },
};
