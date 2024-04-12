import type { IRoute, IResponse, IRequest } from "./types";

/**
 * Splits a route string into a regular expression pattern.
 *
 * @param {string} rt - The route string to split.
 * @return {RegExp} The regular expression pattern generated from the route string.
 */
function splitRoute(rt: string): RegExp {
  const pt = rt.split("/").filter((s) => s.length > 0);
  if (rt.length === 0 || pt.length === 0) {
    return new RegExp("^/$", "g");
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
 */
function match(route: string, path: string) {
  const sp = splitPath(path);
  const sr = splitRoute(route);

  return sr.test(sp);
}

function processExtractedValue(value: string) {
  return value?.replace(/\/+/g, "").trim();
}

/**
 * Returns an array of params extracted from the given route and path.
 *
 * @param {string} route - The route string containing path segments.
 * @param {string} path - The path string to extract values from.
 * @return {Array} An array of values extracted from the route and path.
 */
function juxtPaths(route: string, path: string) {
  const r = route.split("/").filter((s) => s.length > 0);
  const routeRegex = splitRoute(route);
  const routeMatch = routeRegex.exec(path);
  let parametersCount = 0;

  return r.map((item, index) => {
    if (item.startsWith(":") && !item.endsWith("?")) {
      ++parametersCount;
      return {
        [item.substring(1)]: processExtractedValue(routeMatch[parametersCount]),
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
    return item;
  });
}

/**
 * Check if the input entity is an object.
 *
 * @param {unknown} entity - the entity to be checked
 * @return {boolean} true if the entity is an object, false otherwise
 */
function isObject(entity: unknown) {
  return entity && typeof entity === "object" && !Array.isArray(entity);
}

/**
 * Asynchronously routes a request based on the provided route and request object, calls the corresponding method in the route object with the extracted params from the url, and returns the response.
 *
 * @param {IRoute} routeObject - The route object containing information about the route.
 * @param {IPath} request - The path object containing information about the path.
 * @return {IResponse} The response object from the routed request.
 */
async function routeOne(
  routeObject: IRoute,
  request: IRequest
): Promise<IResponse> {
  const juxt = juxtPaths(routeObject.path, request.path || request.url).filter(
    isObject
  );
  const params = { ...request, pathParams: Object.assign({}, ...juxt) };

  if (routeObject.methods && request.method) {
    const resp = await routeObject.methods[request.method](params);
    return resp;
  }
  return routeObject.response && routeObject.response(params);
}

function routeOneSync(routeObject: IRoute, request: IRequest): IResponse {
  const juxt = juxtPaths(routeObject.path, request.path || request.url).filter(
    isObject
  );
  const params = Object.assign({}, ...juxt);

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
