import { HydratedDocument, InferRawDocType, Schema, model } from 'mongoose';
// Schema
const schemaDefinition = {
  name: { type: String, required: true },
  emojies: [{ type: String, required: false }],
  authorId: { type: Schema.ObjectId, required: true },
  description: { type: String, required: false },
  folders: [
    {
      id: { type: Schema.ObjectId, ref: 'Folder' },
      show: { type: Boolean, required: false },
      orderInFolder: { type: Number, required: false },
      addedAt: { type: Date, required: true },
    },
  ],
} as const;
export const ListScehma = new Schema(schemaDefinition, { timestamps: true });

export const List = model('List', ListScehma);
export type TListRaw = InferRawDocType<typeof schemaDefinition>;
export type TList = HydratedDocument<TListRaw>;
