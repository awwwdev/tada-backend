import { HydratedDocument, InferRawDocType, Schema, model } from 'mongoose';
// Schema
const schemaDefinition = {
  name: { type: String, required: true },
  emojies: [{ type: String, required: false }],
  author: { type: Schema.ObjectId, required: true, ref: 'User' },
  lists: [
    {
      id: { type: Schema.ObjectId, ref: 'List', required: true },
      show: { type: Boolean, required: false },
      orderInFolder: { type: Number, required: false },
      addedAt: { type: Date, required: true },
    },
  ],
} as const;
export const FolderScehma = new Schema(schemaDefinition, { timestamps: true });
FolderScehma.set('toJSON', {
  virtuals: true,
});
export const Folder = model('Folder', FolderScehma);
export type TFolderRaw = InferRawDocType<typeof schemaDefinition>;
export type TFodler = HydratedDocument<TFolderRaw>;
