import type { IRoute, IResponse, IRequest } from "./types";

/**
 * Produces a regular expression from the given route string.
 *
 * @param {string} rt - The route string to split.
 * @return {RegExp} The regular expression pattern generated from the route string.
 * @example `pathToRegex("/foo/:id?")` returns /foo/([^/]+)?
 * @example `pathToRegex("/foo/:id")` returns /foo/([^/]+)
 * @example `pathToRegex("/:foo*")` returns /(.*)?
 */
function pathToRegex(rt: string): RegExp {
  const pt = rt.split("/").filter((s) => s.length > 0);
  if (rt.length === 0 || pt.length === 0) {
    return new RegExp("^/$", "g");
  }

  if (rt.includes("*")) {
    return new RegExp(rt.replace(/\:.*?\*/, "(.*)?"), "g");
  }

  const ret = pt
    .map((s, i) => {
      return s.startsWith(":") && !s.endsWith("?")
        ? "([^/]+/?)"
        : s.startsWith(":") && s.endsWith("?")
          ? "([^/]*/?)"
          : i === 0
            ? `^/${s}/?`
            : `${s}/?`;
    })
    .join("");
  return new RegExp(ret, "g");
}

/**
 * Splits the given route path by "/" and removes empty elements.
 *
 * @param {string} route - The route path to be split.
 * @return {string} The modified route path with "/" added at the beginning and end.
 * @example `splitPath("/foo/bar")` returns /foo/bar/
 */
function splitPath(route: string) {
  if (route === "/" || route === "") {
    return "/";
  }

  const pt = route.replace(/\/+/g, "/");
  const sp = pt.split("/").filter((s) => s.length > 0);

  return `/${sp.join("/")}/`;
}

/**
 * A function to match the route with the path.
 *
 * @param {string} route - The route to match.
 * @param {string} path - The path to match against the route.
 * @return {boolean} Returns true if the path matches the route, false otherwise.
 * @example `match("/test/:id", "/test/444")` returns true
 * @example `match("/test/:id", "/test")` returns false
 */
function match(route: string, path: string) {
  const sp = splitPath(path);
  const sr = pathToRegex(route);

  return sr.test(sp);
}

/**
 * Returns the extracted value from the given string, removes slashes and whitespaces.
 *
 * @param value {string} The string to process.
 * @return {string} The processed value.
 * @example `processExtractedValue("/foo     ")` returns foo
 */
function processExtractedValue(value: string) {
  return value?.replace(/\/+/g, "").trim();
}

/**
 * Returns an array of params extracted from the given route and path.
 *
 * @param {string} route - The route string containing path segments.
 * @param {string} path - The path string to extract values from.
 * @return {Array} An array of values extracted from the route and path.
 * @example `extractParams("/foo/:id/:name?", "/foo/444/john")` returns {id: 444, name: "john"}
 * @example `extractParams("/foo/:id/:name?", "/foo/444")` returns {id: 444, name: null}
 */
function extractParams(route: string, path: string) {
  const r = route.split("/").filter((s) => s.length > 0);
  const routeRegex = pathToRegex(route);
  const routeMatch = routeRegex.exec(path);
  let parametersCount = 0;

  return r.map((item) => {
    if (item.includes("*")) {
      ++parametersCount;
      const key = item.substring(1, item.length - 1);
      const val = routeMatch[parametersCount];

      return { [key]: val };
    }
    if (item.startsWith(":") && !item.endsWith("?")) {
      ++parametersCount;
      const key = item.substring(1);
      const val = processExtractedValue(routeMatch[parametersCount]);
      return {
        [key]: val,
      };
    }
    if (item.startsWith(":") && item.endsWith("?")) {
      ++parametersCount;
      let matchedValue =
        routeMatch && processExtractedValue(routeMatch[parametersCount]);
      const match = matchedValue.match(/^[^ ].*/);
      matchedValue = match && match[0];

      const key = item.substring(1).substring(0, item.length - 2);
      const value = matchedValue || null;
      return {
        [key]: value,
      };
    }
  });
}

/**
 * Asynchronously routes a request based on the provided route and request object, calls the corresponding method in the route object with the extracted params from the url, and returns the response.
 *
 * @param {IRoute} routeObject - The route object containing information about the route.
 * @param {IPath} request - The path object containing information about the path.
 * @return {IResponse} The response object from the routed request.
 * @example `routeOne({path: "/foo/:id", methods: {GET: () => ({status: 200, body: "foo"})}}, {url: "/foo/444"})`
 * returns {status: 200, body: "foo"}
 */
async function routeOne(
  routeObject: IRoute,
  request: IRequest
): Promise<IResponse> {
  const extractedParams = extractParams(
    routeObject.path,
    request.path || request.url
  );
  const params = {
    ...request,
    pathParams: Object.assign({}, ...extractedParams),
  };

  if (routeObject.methods && request.method) {
    const resp = await routeObject.methods[request.method](params);
    return resp;
  }
  return routeObject.response && routeObject.response(params);
}

function routeOneSync(routeObject: IRoute, request: IRequest): IResponse {
  const extractedParams = extractParams(
    routeObject.path,
    request.path || request.url
  );
  const params = Object.assign({}, ...extractedParams);

  return routeObject.response && routeObject.response(params);
}

/**
 * Routes the given request to the appropriate route based on the provided uri and method.
 *
 * @param {IRoute[]} routes - An array of route objects representing the available routes.
 * @param {IRequest} pathObject - The path object containing the path and method to be routed.
 * @return {Promise<IResponse>} A promise that resolves to the response object for the routed path.
 */
export async function route(
  routes: IRoute[],
  request: IRequest
): Promise<IResponse> {
  const url = request.url || request.path || "";
  const notFound = { status: 404, body: "Not found" };

  if (!url && url !== "") return notFound;

  const rt = routes.find(
    (r) =>
      match(r.path, url) &&
      (r.methods
        ? r.methods[request.method!]
        : typeof r.response === "function")
  );

  return rt ? await routeOne(rt, request) : notFound;
}

export function routeSync(routes: IRoute[], request: IRequest): IResponse {
  const url = request.url || request.path || "";
  const notFound = { status: 404, body: "Not found" };

  if (!url && url !== "") return notFound;

  const rt = routes.find((r) => {
    return match(r.path, url) && r.response;
  });

  return rt ? routeOneSync(rt, request) : notFound;
}
