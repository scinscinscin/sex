import { RawRoutingEngine } from "./engine";
import { Context } from "./types";

export type Endpoint = (ctx: Context) => void;

type RouterConfig = RawRoutingEngine<Endpoint>;

export interface Router {
  config: RouterConfig;
}

export const createRouter = (config: RouterConfig): Router => {
  return { config };
};
