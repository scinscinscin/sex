import { RawRoutingEngine } from "./engine";
import { Context } from "./types";

type HTTPMethods = "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
export type Endpoint = (ctx: Context) => void;

type Group = {
  [key in HTTPMethods]?: Endpoint;
};

export interface Router {
  config: RawRoutingEngine<Group & { __endpoint: true }>;
}

export interface Config {
  [key: string]: Router | Group;
}

const isRouter = (obj: any): obj is Router => "config" in obj;

export const createRouter = (config: Config): Router => {
  const bruh: Router["config"] = {};

  for (const [key, value] of Object.entries(config)) {
    if (isRouter(value)) bruh[key] = value.config;
    else bruh[key] = { ...value, __endpoint: true };
  }

  return { config: bruh };
};
