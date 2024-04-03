const { route } = require("usher");
const { createServer } = require("node:http");
const { HomeRoute } = require("./routes/main");
const { UserRoute } = require("./routes/user");
const { BooksRouteGet, BooksRoutePost } = require("./routes/books");

const routes = [
  {
    path: "/",
    methods: {
      GET: HomeRoute,
    },
  },
  {
    path: "/user/:id?",
    methods: {
      GET: UserRoute,
    },
  },
  {
    path: "/book/:id?/comment/:commentId?",
    methods: {
      GET: BooksRouteGet,
      POST: BooksRoutePost,
    },
  },
];

const serverAddress = "127.0.0.1";
const serverPort = 3030;

const server = createServer(async (req, res) => {
  const { url, method } = req;

  const { status, body, headers } = await route(routes, { path: url, method });

  res.statusCode = status;
  res.setHeader(...(headers || "Content-Type"), "text/plain");
  res.end(body);
});

server.listen(serverPort, serverAddress, () => {
  console.log(`The server is running at http://${serverAddress}:${serverPort}`);
});
