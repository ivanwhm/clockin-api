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

  @Prop({ required: true })
  salt: string;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
