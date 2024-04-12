# CHANGELOG

## ver. 0.1.6 (2024-04-12)

- **BREAKING CHANGE** now the `routeOne` function takes the extracted params as a `pathParams` object. This allows you to properly pass a complete request object to the handler function. If you need to retrieve the path params, you can now do so as follows: <br>
  `(req) => req.pathParams.someParam` <br>
  before the change: <br>
  `(params) => params.someParam`

- fixed the path to the regex function to get a more precise regex.

- improved the `juxtPaths` function; now it handles white spaces more correctly.
