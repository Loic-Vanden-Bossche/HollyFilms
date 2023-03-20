import { Environment } from "./config.default";
import { DatabaseConfig } from "./config";

export const getSameSiteStrategy = (
  env: Environment
): "strict" | "lax" | "none" => {
  switch (env) {
    case Environment.PROD:
      return "strict";
    case Environment.DEV:
      return "lax";
    default:
      return "none";
  }
};

const getMongoCredentials = (password: string | null, user: string | null) => {
  return password && user ? `${user}:${password}@` : "";
};

export const getMongoString = (config: DatabaseConfig): string =>
  `mongodb${
    config.port || config.host === "localhost" ? "" : "+srv"
  }://${getMongoCredentials(config.password, config.username)}${config.host}${
    config.port ? ":" + config.port : ""
  }/${config.name || ""}?retryWrites=true&w=majority${
    config.password && config.username ? "&authSource=admin" : ""
  }`;
