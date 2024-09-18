import { HydratedDocument, InferRawDocType, Schema, model } from 'mongoose';
// Schema
const schemaDefinition = {
  name: { type: String, required: true },
  emojies: [{ type: String, required: false }],
  authorId: { type: Schema.ObjectId, required: true },
} as const;
export const FolderScehma = new Schema(schemaDefinition, { timestamps: true });

export const Folder = model('Folder', FolderScehma);
export type TFolderRaw = InferRawDocType<typeof schemaDefinition>;
export type TFodler = HydratedDocument<TFolderRaw>;