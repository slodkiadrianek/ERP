import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { Logger } from "../utils/logger.js";
export class logging {
  private logStream: fs.WriteStream;
  logger: Logger;
  constructor(logFileName: string, logger: Logger) {
    this.logStream = fs.createWriteStream(path.join(__dirname, logFileName), {
      flags: "a",
    });
    this.logger = logger;
  }
  logToFile(req: Request, res: Response, next: NextFunction) {
    const logMessage = `${new Date().toISOString()} - ${req.method} ${
      req.url
    }\n`;

    this.logStream.write(logMessage, (err) => {
      if (err) {
        this.logger.error("Failed to write to log file:", err);
        console.error("Failed to write to log file:", err);
      } else {
        this.logger.info(`Log have been written to a file`);
      }
    });

    next();
  }
}
