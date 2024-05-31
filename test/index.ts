import { createRouter, sex } from "../src";

const router = createRouter({
  "/login": {
    POST: async ({ req, res }) => {
      console.log(req.cookies);

      const body = await req.body.json();

      if (body && typeof body["username"] === "string") {
        res.cookies.set("user", body["username"]);
        console.log(body);
        res.raw.write(JSON.stringify({ success: true }));
        return;
      }

      res.raw.write(JSON.stringify({ success: false }));
    },
  },

  "/logout": {
    GET: ({ req, res }) => {
      res.cookies.remove("user");
      res.raw.write("logged out");
    },
  },
});

const app = sex(router);
app.listen(8000, () => {
  console.log("Server started on port 8000");
});
