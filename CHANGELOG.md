# CHANGELOG

## ver. 0.1.7 (2024-04-15)

- now the route can be a wildcard `*` and the route function will return the wildcard value this way: <br>

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
```

returns "wildcard test/some/string"

- some code improvements
- JSDoc examples added

## ver. 0.1.6 (2024-04-12)

- **BREAKING CHANGE** now the `routeOne` function takes the extracted params as a `pathParams` object. This allows you to properly pass a complete request object to the handler function. If you need to retrieve the path params, you can now do so as follows: <br>
  `(req) => req.pathParams.someParam` <br>
  before the change: <br>
  `(params) => params.someParam`

- fixed the path to the regex function to get a more precise regex.

- improved the `juxtPaths` function; now it handles white spaces more correctly.
