import { type IncomingMessage } from "http";

export async function bodyParser(request: IncomingMessage): Promise<Buffer> {
  const body = [] as Buffer[];
  request.on("data", (chunk) => {
    body.push(chunk);
  });

  return new Promise((resolve) => {
    request.on("end", () => {
      resolve(Buffer.concat(body));
    });
  });
}
