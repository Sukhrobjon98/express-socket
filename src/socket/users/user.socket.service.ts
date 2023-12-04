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

  loginSocket = async (data: IUserLogin) => {
    const users = await user
      .findOne({
        username: data.username,
      })
      .exec();

    if (!users) {
      this.io.emit("users:error", {
        message: "Unauthorized",
        status: 401,
      });
    } else {
      console.log(data);
    }
  };

  registerSocket = async (data: IUserRegister) => {
    const newUser = await user.create({
      ...data,
      user_socket_id: this.socket.id,
    });
    newUser.save();
    console.log(newUser);
  };
}
