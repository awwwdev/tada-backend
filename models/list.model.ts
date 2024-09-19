import { HydratedDocument, InferRawDocType, Schema, model } from 'mongoose';
// Schema
const schemaDefinition = {
  name: { type: String, required: true },
  emojies: [{ type: String, required: false }],
  author: { type: Schema.ObjectId, required: true , ref: 'User' },
  description: { type: String, required: false },
  tasks: [
    {
      id: { type: Schema.ObjectId, ref: 'Task' },
      orderInList: { type: Number, required: false },
      addedAt: { type: Date, required: true },
    },
  ],
} as const;
export const ListScehma = new Schema(schemaDefinition, { timestamps: true });
ListScehma.set('toJSON', {
  virtuals: true,
});
export const List = model('List', ListScehma);
export type TListRaw = InferRawDocType<typeof schemaDefinition>;
export type TList = HydratedDocument<TListRaw>;
