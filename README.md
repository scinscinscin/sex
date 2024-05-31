### @scinorandex/sex

A lightweight and faster alternative to express?

### TODO
 - [x] Finish routing and add support for methods
 - [x] Add json body-parser
 - [x] Add cookie-parser
 - [ ] Add multipart-form parser
 - [ ] Add csrf
 - [ ] Add middleware
 - [ ] Add support for implicit returns and automatic content-type detection
 - [ ] Add error handling

### Example
```ts
import { createRouter, sex } from "@scinorandex/sex";

const router = createRouter({
  "/login": {
    POST: async ({ req, res }) => {
      const body = await req.body.json();

      if (body && typeof body["username"] === "string") {
        res.cookies.set("user", body["username"]);
        console.log(body);
        return res.raw.write(JSON.stringify({ success: true }));
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
```

### Benchmark

Speed is not the goal but it's pretty lit

**With express**

Executed using `node expressApp.js`

```
./wrk -c100 -d30 -t4 http://localhost:8000/cats
Running 30s test @ http://localhost:8000/cats
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    24.05ms   59.83ms   1.24s    98.62%
    Req/Sec     1.38k   199.78     2.61k    85.21%
  163885 requests in 30.03s, 37.20MB read
Requests/sec:   5457.80
Transfer/sec:      1.24MB
```

**With sex**

Executed using `node test/index.js`

```
./wrk -c100 -d30 -t4 http://localhost:8000/cats
Running 30s test @ http://localhost:8000/cats
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.24ms   18.58ms 520.36ms   99.27%
    Req/Sec     4.24k   491.61     7.07k    81.79%
  504865 requests in 30.03s, 73.18MB read
Requests/sec:  16812.21
Transfer/sec:      2.44MB
```

Sex is 3.08x faster than express.
