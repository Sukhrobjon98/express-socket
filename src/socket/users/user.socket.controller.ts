import { Server, Socket } from "socket.io";
import { IUserLogin } from "../interface/login.user.interface";
import { IUserRegister } from "../interface/register.user.interface";
import { UserSocketService } from "./user.socket.service";

export class UserSocketController {
  userSocketService: UserSocketService;
  constructor(public io: Server, public socket: Socket) {
    this.userSocketService = new UserSocketService(io, socket);
    this.userLogin();
    this.usersRegister()
  }

  async userLogin() {
    this.socket.on(
      "users:login",
      this.userSocketService.loginSocket,
    );
  }

  async usersRegister() {
    this.socket.on("users:register", this.userSocketService.registerSocket);
  }
}
