import { Query, parseQuery } from "./query";

interface Parsed {
  pathSegments: string[];
  query: Query;
}

export function parseURL(url: string): Parsed {
  // parses the url character by character
  const [path, queryString] = url.split("?");

  const pathSegments = path.split("/").filter((w) => w.length > 0);
  const queryParams = queryString ? parseQuery(queryString) : {};

  return { pathSegments, query: queryParams };
}
