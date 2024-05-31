import http, { IncomingMessage, ServerResponse } from "http";
import { Endpoint, HTTPMethods, Router } from "./router";
import { parseURL } from "./parser/path";
import { compileRouteTree, matchPathToEndpoint } from "./engine";
import { Context, Cookies, Request, Response } from "./types";
import { Query } from "./parser/query";
import { bodyParser } from "./parser/body";

interface SexOptions {
  notFound?: Endpoint;
}

export const sex = function (router: Router, opts?: SexOptions) {
  const compiled = compileRouteTree(router.config);

  const notFoundHandler: Endpoint =
    opts?.notFound ??
    (({ req, res: { raw: response } }) => {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.write("Not Found");
      response.end();
    });

  const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    // should never run?
    if (typeof req.url !== "string") return res.end();

    const { pathSegments, query } = parseURL(req.url);
    const endpoint = matchPathToEndpoint(compiled, pathSegments);

    const context: Context = {
      res: createResponse(res),
      req: createRequest(req, query, endpoint?.variables ?? {}),
    };

    if (endpoint && req.method && req.method in endpoint.value)
      await endpoint.value[req.method as HTTPMethods]!(context);
    else notFoundHandler(context);

    res.end();
    return;
  });

  return {
    httpServer: server,
    listen: (port: number, callback?: () => void) => {
      server.listen(port, callback);
    },
  };
};

function createRequest(raw: IncomingMessage, query: Query, path: { [key: string]: string }): Request {
  async function json() {
    const body = await bodyParser(raw);
    return JSON.parse(body.toString());
  }

  return { raw, query, path, body: { json } };
}

const setCookieHeader = (response: ServerResponse, cookies: Cookies): string[] => {
  const ret: string[] = [];
  for (const [name, obj] of Object.entries(cookies)) {
    let cookieString = `${name}="${obj.value}";`;
    if (obj.options?.maxAge != null) cookieString += `Max-Age=${obj.options.maxAge};`;

    ret.push(cookieString);
  }

  response.setHeader("Set-Cookie", ret);
  return ret;
};

function createResponse(res: ServerResponse): Response {
  // TODO: add options here for the cookie
  const cookies = {} as Cookies;

  /**
   * Adds a cookie to the response object
   * @param name The name of the cookie
   * @param value The value of the cookie
   */
  function set(name: string, value: string) {
    cookies[name] = { value };
    setCookieHeader(res, cookies);
  }

  /**
   * Removes a cookie from the client
   * @param name Name of the cookie to delete
   */
  function remove(name: string) {
    cookies[name] = { value: "", options: { maxAge: 0 } };
    setCookieHeader(res, cookies);
  }

  return { raw: res, cookies: { set, remove } };
}
