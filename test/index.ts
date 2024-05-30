import { createRouter, sex } from "../src";

const router = createRouter({
  "/cats": ({ req, res }) => {
    res.raw.write("I love cats");
    res.raw.end();
  },
});

const app = sex(router);
app.listen(8000, () => {
  console.log("Server started on port 8000");
});
