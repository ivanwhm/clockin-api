import { Schema } from 'mongoose';

export const AccountSchema = new Schema(
  {
    username: {
      type: Schema.Types.String,
      unique: true,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    password: {
      type: Schema.Types.String,
      required: true,
      minlength: 8,
      maxlength: 150,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    validateBeforeSave: true,
  },
);
