import { type Endpoint } from "./router";

export type HeirarchyEnd = {
  handler: Endpoint;
};

export const removeWrappingSlashes = (str: string) => {
  if (str[0] == "/") str = str.slice(1, str.length);
  else if (str[str.length - 1] == "/") str = str.slice(0, str.length - 1);
  return str;
};

/**
 * A human friendly interface representing routes
 */
export interface RawRoutingEngine<T extends Function> {
  [key: string]: RawRoutingEngine<T> | T;
}

export type CompiledRoutingEngine<T extends Function> = [string[], CompiledRoutingEngine<T> | T][];

/**
 * Compiles a RawRoutingEngine object into CompiledRoutingEngine
 */
export const compileRouteTree = <T extends Function>(h: RawRoutingEngine<T>): CompiledRoutingEngine<T> => {
  return Object.entries(h).map(([path, subroute]) => {
    const pathSegments = removeWrappingSlashes(path).split("/");
    const val = typeof subroute === "function" ? subroute : compileRouteTree(subroute);
    return [pathSegments, val];
  });
};

const getIndexHandler = <T extends Function>(c: CompiledRoutingEngine<T>): T | null => {
  const indexSubrouter = c.find((sr) => sr[0][0] === "");
  if (!indexSubrouter) return null;
  if (typeof indexSubrouter[1] === "function") return indexSubrouter[1];
  else return getIndexHandler(indexSubrouter[1]);
};

type Matched<T> = { variables: { [key: string]: string }; value: T };

/**
 * A sketchy reimplementation of express' routing engine.
 * @param heirarchy - a compiled routing heirarchy
 * @param segments - path segments
 **/
export const matchPathToEndpoint = function <T extends Function>(
  heirarchy: CompiledRoutingEngine<T>,
  segments: string[]
): Matched<T> | null {
  checkSubrouters: for (const [path, subrouter] of heirarchy) {
    // if template has more segments than what needs to be matched, use next template
    if (path.length > segments.length) continue;
    // if segments has more parts then path,j then subrouter cannot be a function
    if (path.length < segments.length && typeof subrouter === "function") continue;

    const variables: { [key: string]: string } = {};

    checkPathSegments: for (let i = 0; i < path.length; i++) {
      const x = path[i],
        y = segments[i];

      // direct match, check the next path segment
      if (x === y) continue checkPathSegments;
      // x is a path variable, save it then apply y to it before checking the next path segment
      else if (x.startsWith(":")) {
        variables[x.slice(1, x.length)] = y;
        continue checkPathSegments;
      }

      // failed to match, then try the next subrouter
      else continue checkSubrouters;
    }

    // is a direct match
    if (path.length === segments.length) {
      if (typeof subrouter !== "object") return { variables, value: subrouter };
      const indexHandler = getIndexHandler(subrouter);
      if (indexHandler) return { variables, value: indexHandler };
    }

    // segments has more parts to it
    else if (path.length < segments.length) {
      // get parts of segment not matched by current router
      const remainingSegments = segments.slice(path.length, segments.length);
      if (typeof subrouter !== "function") {
        const fn = matchPathToEndpoint(subrouter, remainingSegments);
        if (fn != null) {
          const { value: handler, variables: subrouterVars } = fn;
          return { variables: { ...variables, ...subrouterVars }, value: handler };
        }
      }
    }
  }

  // none matched so return null
  return null;
};
