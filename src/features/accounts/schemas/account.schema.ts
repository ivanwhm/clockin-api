import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MongoTimestamps } from 'src/core/interfaces/mongo-timestamps';

export type AccountDocument = Account & Document & MongoTimestamps;

@Schema({
  timestamps: true,
  validateBeforeSave: true,
})
export class Account {
  @Prop({ required: true, unique: true, minlength: 3, maxlength: 30 })
  username: string;

  @Prop({ required: true, unique: true, minlength: 8, maxlength: 150 })
  password: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
