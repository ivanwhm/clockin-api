import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { config } from './core/config';
import { AccountModule } from './features/accounts/account.module';

const { user, password, type, host, port, name } = config.database;

@Module({
  imports: [
    MongooseModule.forRoot(`${type}://${user}:${password}@${host}:${port}/${name}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    AccountModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
