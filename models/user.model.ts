import mongoose, { HydratedDocument, InferRawDocType } from 'mongoose';
import { isEmail } from 'validator';
const Schema = mongoose.Schema;

const schemaDefinition = {
  // username: {
  //   type: String,
  //   required: false,
  //   unique: true,
  // },
  folders: [
    {
      id: { type: Schema.ObjectId, ref: 'Folder' },
      name: { type: String, required: true },
    },
  ],
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value: string) {
        return isEmail(value);
      },
      message: 'Invalid email.',
    },
  },
  passwordHash: {
    type: Buffer,
    required: true,
    select: false,
  },
  salt: { type: Buffer, required: true, select: false },
  settings: {
    startOfWeek: {
      type: String,
      required: true,
      default: 'sunday',
      enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    },
    showCompletedTasks: {
      type: Boolean,
      required: true,
      default: false,
    },
    theme: {
      type: String,
      required: true,
      default: 'system',
      enum: ['light', 'dark', 'system'],
    },
  },
} as const;
const UserSchema = new Schema(schemaDefinition, { timestamps: true });
UserSchema.set('toJSON', {
  virtuals: true,
});
export const User = mongoose.model('User', UserSchema);
export type TUserRaw = InferRawDocType<typeof schemaDefinition>;
export type TUser = HydratedDocument<TUserRaw>;
