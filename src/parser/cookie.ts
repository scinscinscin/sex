export function parseCookieHeader(cookieHeader: string): { [key: string]: string } {
  const ret: { [key: string]: string } = {};

  for (const cookiePairs of cookieHeader.split(";").map((e) => e.trim())) {
    const [key, value] = cookiePairs.split("=");
    ret[key] = removeWrappingQuotes(value);
  }

  return ret;
}

const removeWrappingQuotes = (e: string) => {
  if (e.length < 2 || e[0] !== '"' || e[e.length - 1] !== '"') return e;
  else return e.slice(1, e.length - 1);
};
