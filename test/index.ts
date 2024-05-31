import { createRouter, sex } from "../src";

const dogsRouter = createRouter({
  "/": {
    GET: ({ req, res }) => {
      res.raw.write("I love dogs");
      res.raw.end();
    },
  },
});

const router = createRouter({
  "/cats": {
    GET: ({ req, res }) => {
      res.raw.write("I love cats");
      res.raw.end();
    },
  },

  "/dogs": dogsRouter,
});

const app = sex(router);
app.listen(8000, () => {
  console.log("Server started on port 8000");
});
