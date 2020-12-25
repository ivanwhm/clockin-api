import { Document } from 'mongoose';

export interface Account extends Document {
  readonly username: string;
  password: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
