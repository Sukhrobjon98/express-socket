import user from "../../model/user.model";
import { IUserLogin } from "../interface/login.user.interface";
import HttpException from "../../exception/http.exception";
import { Server, Socket } from "socket.io";
import { IUserRegister } from "../interface/register.user.interface";

export class UserSocketService {
  userModel: any;
  constructor(public io: Server, public socket: Socket) {
    this.userModel = user;
  }

  loginSocket = async (data: IUserLogin, callback: any) => {
    
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

    const newUser = (
      await user.create({
        ...data,
        user_socket_id: this.socket.id,
      })
    ).save();
    callback({
      message: "Registration successful",
      status: 201,
    });
  };
}
