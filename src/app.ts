import express, { NextFunction, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import { IRouter } from "./interfaces/router.interface";
import mongoose from "mongoose";
import { UserSocketController } from "./socket/users/user.socket.controller";
import ErrorMiddleware from "./middlewares/error.middleware";
import cors from "cors";
import path from "path";

export class App {
  app: http.Server;
  port: number;
  socketIo: Server;
  apps: express.Application;

  constructor(routers: IRouter[]) {
    this.port = 4000;
    this.apps = express();
    this.app = http.createServer(express());
    this.socketIo = new Server(this.app, {
      cors: {
        origin: "*",
      },
    });
    this.initMiddleware();
    this.initErrorHandling();
    this.initSocket();
    this.initDatabase();
    this.listen();
  }

  initMiddleware() {
    this.apps.use(cors());
    this.apps.use(express.json());
    this.apps.use(express.urlencoded({ extended: true }));
    this.apps.use(express.static(path.join(process.cwd(), "uploads")));
  }

  initErrorHandling() {
    this.apps.use(ErrorMiddleware);
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
