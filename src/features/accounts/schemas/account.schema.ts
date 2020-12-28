import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema({
  timestamps: true,
  validateBeforeSave: true,
})
export class Account {
  @Prop({ required: true, unique: true, minlength: 3, maxlength: 30 })
  username: string;

  @Prop({ required: true, unique: true, minlength: 8, maxlength: 150 })
  password: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
