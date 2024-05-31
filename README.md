### @scinorandex/sex

A lightweight and faster alternative to express?

### TODO
 - [ ] Finish routing and add support for methods
 - [ ] Add cookie-parser
 - [ ] Add body-parser
 - [ ] Add multipart-form parser
 - [ ] Add csrf
 - [ ] Add middleware
 - [ ] Add error handling

### Example
```ts
import { createRouter, sex } from "@scinorandex/sex";

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
```

### Benchmark

Speed is not the goal but it's pretty lit

**With express**

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

```
./wrk -c100 -d30 -t4 http://localhost:8000/cats
Running 30s test @ http://localhost:8000/cats
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.25ms   19.75ms 557.25ms   99.16%
    Req/Sec     4.34k   518.38     6.01k    82.94%
  516340 requests in 30.02s, 74.85MB read
Requests/sec:  17200.34
Transfer/sec:      2.49MB
```

Sex is 3.15x faster than express.