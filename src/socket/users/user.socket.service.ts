import user from "../../model/user.model";
import { IUserLogin } from "../interface/login.user.interface";
import HttpException from "../../exception/http.exception";
import { Server, Socket } from "socket.io";
import { IUserRegister } from "../interface/register.user.interface";
import { writeFileSync } from "fs";
import path from "path";

export class UserSocketService {
  userModel: any;
  constructor(public io: Server, public socket: Socket) {
    this.userModel = user;
  }

  loginSocket = async (data: IUserLogin, callback: any) => {
    console.log(this.socket.rooms);
    this.socket.join(data.username);
    console.log(this.socket.rooms);

    const users = await user
      .findOne({
        username: data.username,
      })
      .exec();

    if (!users) {
      callback({
        message: "Unauthorized",
        status: 401,
      });
    } else {
      const updateUser = await user.updateOne({
        user_socket_id: this.socket.id,
      });
      callback({
        message: "Login successful",
        status: 200,
      });
    }
  };

  registerSocket = async (data: IUserRegister, callback: any) => {
    const hasUser = user
      .findOne({
        username: data.username,
      })
      .exec();

    if (hasUser != null) {
      callback({
        message: "User already exsist",
      });
    }
    let filename = data.file.fileName;
    let file = data.file.file;
    let file_path = path.join(process.cwd(), "uploads", "images", filename);
    writeFileSync(file_path, file, { encoding: "base64" });
    const newUser = (
      await user.create({
        ...data,
        user_socket_id: this.socket.id,
        file: file_path,
      })
    ).save();
    callback({
      message: "Registration successful",
      status: 201,
    });
  };
}
