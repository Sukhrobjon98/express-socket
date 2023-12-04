import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import { IRouter } from "./interfaces/router.interface";
import mongoose from "mongoose";

export class App {
  app: http.Server;
  port: number;
  socketIo: Server;

  constructor(routers: IRouter[]) {
    this.port = 3000;
    this.app = http.createServer(express());
    this.socketIo = new Server(this.app);
    this.listen();
    this.initMiddleware();
    this.initSocket();
    this.initDatabase()
  }

  initMiddleware() {
    const expressApp = express();
    this.app.on("request", expressApp);
    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));
  }

  initSocket() {
    this.socketIo.on("connect", (socket: Socket) => {
      console.log("User is connected");
    });
  }
  

  async initDatabase() {
    try {
      await mongoose.connect("mongodb://localhost:27017/myapp");
      console.log("Mongodb connected");
    } catch (error) {
      console.log(error);
    }
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}
