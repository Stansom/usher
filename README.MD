# USHER

## A simple routing library for JavaScript browser and server-side, inspired by Clojure-style development.

There are two main functions for controlling your routes:

- `route(routesArray, request)` is the async version of the route function
- `routeSync(routesArray, request)` is the same function, but sync
- **routesArray** is an array of routes objects, <br>
  the objects are in the form: <br>

```javascript
{
   path: '/some/route/',
   methods?: {
       GET: ({ pathParams: params }) => ({
            status: 200,
            body: `Hi ${params.name}!`}),
       POST: (params) => ({
            status: 200,
            body: "The user has been added!"}),
   },
   response?: ({ pathParams: params }) =>
        <><h1>Hello from the browser</h1></>
}
```

Where:

- **path** is a path as a string, <br>
- **methods** is an optional object, used mainly on the server side, it contains method name and function to respond. <br>
  The methods can be: "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "PATCH"
- **response** is an optional function, it's commonly used for frontend.
- **pathParams** that are passed to the response functions are extracted from a route based on a given path, for example: <br>
  > "/user/:name" extracts the :name from the "/user/john" route and passes it to the response function, so it can be used like this: <br>
  >
  > ```javascript
  > (request) =>
  >   `Hello, user ${request.pathParams.name}. And welcome to the site.`;
  > // returns "Hello, user john. And welcome to the site.
  > ```
  >
  > "/user/:name/:surname?" where surname is an optional parameter, the route function will try to match it and if not will return the param with a null value.
  >
  > ```javascript
  > ({ pathParams: params }) => {
  >   return `Hello ${params.name}${
  >     params.surname ? ` with surname ${params.surname}` : "."
  >   }`;
  > };
  > // matching route "/name/jay/surname/rutanga"
  > // returns "Hello jay with surname rutanga
  > // matching route "/name/jay"
  > // returns "Hello jay.
  > ```

### For the server-side it looks like this:

> ```javascript
> const routes = [
>   {
>     path: "/home/",
>     methods: {
>       GET: () => {
>         return {
>           status: 200,
>           body: "Hello from the home route!",
>         };
>       },
>     },
>   },
>   {
>     path: "/user/:id",
>     methods: {
>       GET: ({ pathParams: { id } }) => {
>         return {
>           status: 200,
>           body: `Hi user ${id}! How are you doing?`,
>         };
>       },
>     },
>   },
> ];
> ```
>
> request is an object in that form:
>
> ```javascript
> const request = {
>   path: "/home/",
>   method: "GET",
> };
> ```
>
> Just call the route function with a routes array and a request object to get a response object <br>
> which can be used in any server, watch [the example](examples/node_example/README.MD) for NodeJS in the examples directory.
>
> ```javascript
> await response = route(routes, request);
> // response is:
> // {
> //    status: 200,
> //    body: "hello from the home route!",
> // };
> ```

---

### This is the browser version(using React in this example):

> ```javascript
> const routes = [
>   {
>     path: "/about/",
>     response: () => {
>       return (
>         <>
>           <h1>USHER</h1>
>           <p>A simple routing library for JS</p>
>         </>
>       );
>     },
>   },
>   {
>     path: "/book/:id",
>     response: ({ id }) => {
>       return `Book ${id} found, you can read it.`;
>     },
>   },
> ];
> ```
>
> request is an object in that form:
>
> ```javascript
> const request = {
>   path: "/book/55",
> };
> ```
>
> In the browser version you can call the sync version of the function to get the result of the matched route. Please refer to [the React example](examples/react_example/README.md) in the examples directory.
>
> ```javascript
> response = routeSync(routes, request);
> // response is:
> // "Book 55 found, you can read it.",
> ```

the route also can be a wildcard `*` and the route function will return the wildcard value this way: <br>

```javascript
route(
  [
    {
      route: "/main/:test*",
      handlers: { GET: (req) => `wildcard ${req.pathParams.test}` },
    },
  ],
  {
    url: "/main/test/some/string",
    method: "GET",
  }
);
// returns "wildcard test/some/string"
```

---

## SUMMARY:

**In summary,** the route functions take an array of routes and a path object, and return the response when the paths are matched or `{ status: 404, body: "Not found" }` object if there are no matched routes.<br>
This means that you can return anything from the 'response' function and handle a request in a very flexible way.

## BUILD:

To build the library run the following command in teminal: <br>
`npm i && npm run build`
