import mongoose, { HydratedDocument, InferRawDocType } from 'mongoose';
import { isEmail } from 'validator';
const Schema = mongoose.Schema;

const schemaDefinition = {
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value: string) {
        return isEmail(value);
      },
      message: 'Invalid email.',
    }
  },
  passwordHash: {
    type: Buffer,
    required: true,
    select: false,
  },
  salt: { type: Buffer, required: true, select: false },
} as const;
const UserSchema = new Schema(schemaDefinition, { timestamps: true });

export const User = mongoose.model('User', UserSchema);
export type TUserRaw = InferRawDocType<typeof schemaDefinition>;
export type TUser = HydratedDocument<TUserRaw>;

