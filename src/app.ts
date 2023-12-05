import express, { NextFunction, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import { IRouter } from "./interfaces/router.interface";
import mongoose from "mongoose";
import { UserSocketController } from "./socket/users/user.socket.controller";
import ErrorMiddleware from "./middlewares/error.middleware";
import cors from "cors";

export class App {
  app: http.Server;
  port: number;
  socketIo: Server;

  constructor(routers: IRouter[]) {
    this.port = 3200;
    this.app = http.createServer(express());
    this.socketIo = new Server(this.app);
    this.listen();
    this.initMiddleware();
    this.initErrorHandling();
    this.initSocket();
    this.initDatabase();
  }

  initMiddleware() {
    const expressApp = express();
    this.app.on("request", expressApp);
    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));
    expressApp.use((req: Request, res: Response, next: NextFunction) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Max-Age", "1800");
      res.setHeader("Access-Control-Allow-Headers", "content-type");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "PUT, POST, GET, DELETE, PATCH, OPTIONS"
      );
      next();
    });
    expressApp.use(cors());
  }

  initErrorHandling() {
    this.app.on("request", express());
    express().use(ErrorMiddleware);
  }

  initSocket() {
    this.socketIo.on("connect", (socket: Socket) => {
      console.log("User connected");

      new UserSocketController(this.socketIo, socket);
      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
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
