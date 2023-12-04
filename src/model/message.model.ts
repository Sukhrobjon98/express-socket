import mongoose, { Schema } from "mongoose";
enum EMessage {
  message,
  image,
  video,
}
interface IMessage extends Document {
  message_body: Text;
  message_from: Schema.Types.ObjectId;
  message_to: Schema.Types.ObjectId;
  message_type: EMessage;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    message_body: {
      type: Text,
      required: true,
    },
    message_type: EMessage,
    message_from: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    message_to: [{ type: Schema.Types.ObjectId, required: true, ref: "user" }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const messsage = mongoose.model<IMessage>("message", messageSchema);

export default messsage