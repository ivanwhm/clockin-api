export interface Config {
  app: {
    protocol: string;
    host: string;
    isProduction: boolean;
    timeZone: string;
  };
  database: {
    type: string;
    port: number;
    host: string;
    user: string;
    password: string;
    name: string;
  };
}
