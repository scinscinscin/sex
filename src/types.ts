import { IncomingMessage, ServerResponse } from "node:http";
import { Query } from "./parser/query";

export interface Cookies {
  [key: string]: {
    value: string;
    options?: {
      maxAge: number;
    };
  };
}

type JSONLiteral = string | number | boolean | null;
type JSON = JSON[] | JSONLiteral | { [key: string]: JSON };

export interface Request {
  raw: IncomingMessage;
  query: Query;
  path: { [key: string]: string };
  body: { json(): Promise<JSON> };
}

export interface Response {
  cookies: {
    set: (cookieName: string, value: string) => void;
    remove: (cookieName: string) => void;
  };
  raw: ServerResponse;
}

export type Context = {
  req: Request;
  res: Response;
};
