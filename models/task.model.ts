import { HydratedDocument, InferRawDocType, Schema, model } from 'mongoose';
// Schema
const schemaDefinition = {
  label: { type: String, required: true },
  emojies: [{ type: String, required: false }],
  author: { type: Schema.ObjectId, required: true, ref: 'User' },
  description: { type: String, required: false },
  // lists: [
  //   {
  //     id: { type: Schema.ObjectId, ref: 'List' },
  //     orderInList: { type: Number, required: false },
  //     addedAt: { type: Date, required: true },
  //   },
  // ],
  status: {
    type: String,
    required: true,
    enum: ['to-do', 'done'],
  },
  dueAt: { type: Date, required: false },
  deleted: { type: Boolean, required: false },
  starred: { type: Boolean, required: false },
  pinned: { type: Boolean, required: false },
  archived: { type: Boolean, required: false },

  steps: [{ type: Schema.ObjectId, ref: 'Task' }],
  preTasks: [{ type: Schema.ObjectId, ref: 'Task' }],
  postTasks: [{ type: Schema.ObjectId, ref: 'Task' }],
  comments: [
    {
      author: { type: Schema.ObjectId, ref: 'User' },
      body: { type: String, required: true },
      createdAt: { type: Date, required: true },
      // replyToCommentId: { type: Schema.ObjectId, ref: 'Comment' },
    },
  ],
  assingnees: [
    {
      authorId: { type: Schema.ObjectId, ref: 'User' },
      createdAt: { type: Date, required: true },
    },
  ],
  attachments: [
    {
      authorId: { type: Schema.ObjectId, ref: 'User' },
      body: { type: String, required: true },
      createdAt: { type: Date, required: true },
    },
  ],
  reminders: [{
    minutesBeforeDueDate: { type: Number, required: true },
    remindAt: { type: Date, required: true },
  }],
  routins: [
    {
      startAt: { type: Date, required: true },
      endAt: { type: Date, required: true },
      numberOfRepeats: { type: Number, required: true },
      periods: {
        type: Number, required: true,
        enum: ['minute', 'hour', 'day', 'week', 'month', 'year']
      },
      everyXPeriods: { type: Number, required: true },
      notification: { type: Boolean, required: false, }
    }
  ]

} as const;
export const TaskSchema = new Schema(schemaDefinition, { timestamps: true });
TaskSchema.set('toJSON', {
  virtuals: true,
});
export const Task = model('Task', TaskSchema);
export type TTaskRaw = InferRawDocType<typeof schemaDefinition>;
export type TTask = HydratedDocument<TTaskRaw>;