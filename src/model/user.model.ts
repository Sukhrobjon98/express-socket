import mongoose from "mongoose";

interface IUser extends Document {
  user_socket_id: string;
  file: string;
  username: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    user_socket_id: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      default: null,
    },  
  },
  {
    versionKey: false,
  }
);

const user = mongoose.model<IUser>("user", userSchema);

export default user;
