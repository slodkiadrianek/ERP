import winston from "winston";
import { format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export class Logger {
  private logger: winston.Logger;
  private context?: string;

  constructor(context?: string) {
    this.context = context;
    this.logger = this.createLogger();
  }
  //Creating logger
  protected createLogger(): winston.Logger {
    const { combine, timestamp, printf, colorize, errors } = format;
    const logFormat = printf(
      ({ level, message, timestamp, context, ...meta }) => {
        const contextStr = context ? `[${context}] ` : "";
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
        return `${timestamp} ${level}: ${contextStr}${message} ${metaStr}`;
      }
    );
    //Information about transport
    const transports: winston.transport[] = [
      new winston.transports.Console({
        level: process.env.NODE_ENV === "production" ? "info" : "debug",
        format: combine(colorize(), logFormat),
      }),

      // Logs for erros
      new DailyRotateFile({
        level: "error",
        filename: "logs/error-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
      }),

      // logs for all
      new DailyRotateFile({
        filename: "logs/combined-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
      }),
    ];

    return winston.createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: combine(timestamp(), errors({ stack: true }), logFormat),
      transports,
      defaultMeta: { context: this.context },
    });
  }
  //Debug logs
  public debug(message: string, meta: object = {}): void {
    this.logger.debug(message, { ...meta, context: this.context });
  }
  //error logs
  public error(message: string, meta: object = {}): void {
    this.logger.error(message, { ...meta, context: this.context });
  }

  //Info logs
  public info(message: string, meta: object = {}): void {
    this.logger.info(message, { ...meta, context: this.context });
  }
}
