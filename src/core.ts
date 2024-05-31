import http from "http";
import { Endpoint, Router } from "./router";
import { parseURL } from "./parser/path";
import { compileRouteTree, matchPathToEndpoint } from "./engine";
import { Context } from "./types";

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

  const server = http.createServer((req, res) => {
    // should never run?
    if (typeof req.url !== "string") return res.end();

    const { pathSegments, query } = parseURL(req.url);
    const endpoint = matchPathToEndpoint(compiled, pathSegments);

    const context: Context = {
      res: { raw: res },
      req: {
        raw: req,
        query,
        path: endpoint?.variables ?? {},
      },
    };

    if (endpoint && req.method && req.method in endpoint.value) return endpoint.value[req.method](context);
    else notFoundHandler(context);

    if (!res.closed) res.end();
  });

  return {
    httpServer: server,
    listen: (port: number, callback?: () => void) => {
      server.listen(port, callback);
    },
  };
};
