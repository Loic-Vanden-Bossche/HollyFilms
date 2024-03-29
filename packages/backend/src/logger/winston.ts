import * as winston from "winston";
import * as chalk from "chalk";
import { getLogLevels, LogLevels } from "./log-levels";
import { WinstonModule } from "nest-winston";
import { LoggerService } from "@nestjs/common";
import { Environment } from "../config/config.default";
import * as WinstonGraylog from "winston-graylog2";

const getMaxLevel = (levels: { [p: string]: number }): string => {
  return Object.keys(levels).reduce((acc, key) => {
    if (levels[key] > levels[acc]) {
      return key;
    }
    return acc;
  }, "error");
};

const winstonLogLevels = (
  env: Environment,
  verbose: boolean,
  allLogValues: { [p: string]: number }
): { [p: string]: number } => {
  const levels = getLogLevels(env, verbose);
  return Object.keys(allLogValues)
    .filter((key) => levels.includes(allLogValues[key]))
    .reduce((obj, key) => {
      return Object.assign(obj, { [key]: allLogValues[key] });
    }, {});
};

const logValues = () => {
  return Object.entries(LogLevels).reduce(
    (acc, [key, value]) =>
      typeof value === "number" ? { ...acc, [key.toLowerCase()]: value } : acc,
    {}
  );
};

export const getWinstonLogger = (
  env: Environment,
  logsPath: string,
  verbose = false
): LoggerService => {
  const levels = logValues();

  return WinstonModule.createLogger({
    levels,
    level: getMaxLevel(winstonLogLevels(env, verbose, levels)),

    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.label({ label: "HollyFilms" }),
          winston.format.timestamp({ format: "YYYY/MM/DD HH:mm:ss" }),
          winston.format.splat(),
          winston.format.printf(
            ({ level, message, label, timestamp, context }) => {
              switch (level.toUpperCase()) {
                case "ERROR":
                  message = chalk.red(message);
                  level = chalk.black.bgRedBright.bold(level);
                  break;

                case "WARN":
                  message = chalk.yellow(message);
                  level = chalk.black.bgYellowBright.bold(level);
                  break;

                case "INFO":
                  message = chalk.green(message);
                  level = chalk.black.bgGreenBright.bold(level);
                  break;

                case "HTTP":
                  message = chalk.blue(message);
                  level = chalk.black.bgBlueBright.bold(level);
                  break;

                case "DEBUG":
                  message = chalk.magenta(message);
                  level = chalk.black.bgMagentaBright.bold(level);
                  break;

                case "VERBOSE":
                  message = chalk.cyan(message);
                  level = chalk.black.bgCyanBright.bold(level);
                  break;

                default:
                  break;
              }
              return `[${chalk.blue(label)}] [${chalk.magenta(
                timestamp
              )}] [${level}] [${chalk.bold(context)}]: ${message}`;
            }
          )
        ),
      }),
      new WinstonGraylog({
        name: "Graylog",
        silent: false,
        handleExceptions: false,
        graylog: {
          servers: [
            {
              host: "127.0.0.1",
              port: 12201,
            },
          ],
          bufferSize: 1400,
        },
      }),
    ],
  });
};
