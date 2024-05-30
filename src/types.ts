import { IncomingMessage, ServerResponse } from "node:http";
import { Query } from "./parser/query";

export interface Request {
  raw: IncomingMessage;
  query: Query;
  path: { [key: string]: string };
}

export interface Response {
  raw: ServerResponse;
}

export type Context = {
  req: Request;
  res: Response;
};
