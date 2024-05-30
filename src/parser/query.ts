export type Query = { [key: string]: string | string[] };
// a function that parses queries
export function parseQuery(_qs: string): Query {
  const [qs] = _qs.split("#"); // ignore everything after the #;
  const parts = qs.split("&");

  const ret: Query = {};
  for (const part of parts) {
    const [key, _value] = part.split("=");
    const value = decodeURIComponent(_value);

    if (typeof ret[key] == "undefined") ret[key] = value;
    else if (typeof ret[key] == "string") ret[key] = [ret[key] as string, value];
    else (ret[key] as string[]).push(value);
  }

  return ret;
}
