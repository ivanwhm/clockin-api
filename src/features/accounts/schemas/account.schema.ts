import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  validateBeforeSave: true,
})
export class Account extends Document {
  @Prop({ required: true, unique: true, minlength: 3, maxlength: 30 })
  username: string;

  @Prop({ required: true, minlength: 8, maxlength: 150 })
  password: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type AccountDocument = Account;
export const AccountSchema = SchemaFactory.createForClass(Account);
