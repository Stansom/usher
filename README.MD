# USHER

## A simple routing library for JavaScript browser and server-side, inspired by Clojure-style development.

There are two main functions for controlling your routes:

- `route(routesArray, path)` is the async version of the route function
- `routeSync(routesArray, path)` is the same function, but sync

---

### For server-side it looks like this:

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
>       GET: ({ id }) => {
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
> path is an object in that form:
>
> ```javascript
> const request = {
>   path: "/home/",
>   method: "GET",
> };
> ```
>
> Just call the route function with routes array and requst to get a response object </br>
> which can be used in any server, look an example for NodeJS in the examples directory.
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

### This is a browser version(using React in this example):

> ```javascript
> const routes = [
>   {
>     path: "/about/",
>     response: () => {
>       return (
>         <>
>           <h1>USHER</h1>
>           <p>The simple routing library for JS</p>
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
> path is an object in that form:
>
> ```javascript
> const request = {
>   path: "/book/55",
> };
> ```
>
> In the browser version you can call the sync version to get the result of the matched route. Please refer to the React example in the examples directory.
>
> ```javascript
> response = routeSync(routes, request);
> // response is:
> //    "Book 55 found, you can read it.",
> ```

---

## SUMMARY:

**In summary,** the route functions take an array of routes and a path object, and return the response when the paths are matched or `{ status: 404, body: "Not found" }` object if there are no matched routes.</br>
This means that you can return anything from the 'response' function and handle a request in a very flexible way.

## BUILD:

To build the library run the following command in teminal: </br>
`npm i && npm run build`
