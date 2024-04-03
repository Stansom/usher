import type { IRoute, IPath, IResponse } from "./types";

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
      if (s.startsWith(":") && !s.endsWith("?")) {
        if (i === pt.length - 1) {
          return "/.*";
        }
        return "/.*?/";
      } else if (s.startsWith(":") && s.endsWith("?")) {
        if (i === pt.length - 1) {
          return "(/.*)?";
        }
        return "(/.*)*/";
      } else if (i === 0) {
        return "^/" + s;
      } else {
        return `${s}`;
      }
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

/**
 * Returns an array of params extracted from the given route and path.
 *
 * @param {string} route - The route string containing path segments.
 * @param {string} path - The path string to extract values from.
 * @return {Array} An array of values extracted from the route and path.
 */
function juxtPaths(route: string, path: string) {
  const r = route.split("/").filter((s) => s.length > 0);
  const p = path
    .replace(/\/+/g, "/")
    .split("/")
    .filter((s) => s.length > 0);
  const routeRegex = splitRoute(route);
  const routeMatch = routeRegex.exec(path);
  let optionalMatches = 0;

  return r.map((item, index) => {
    if (item.startsWith(":") && !item.endsWith("?")) {
      return { [item.substring(1)]: p[index] };
    }
    if (item.startsWith(":") && item.endsWith("?")) {
      ++optionalMatches;
      // if (routeMatch && !routeMatch[optionalMatches]) {
      //   const oldItem = p[index];
      //   p[index] = "";
      //   p[index + 1] = oldItem;
      // }
      const matchedValue =
        routeMatch && routeMatch[optionalMatches]?.substring(1);
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
 * Asynchronously routes a request based on the provided route and path objects, calls the corresponding method in the route object with the extracted params, and returns the response.
 *
 * @param {IRoute} routeObject - The route object containing information about the route.
 * @param {IPath} pathObject - The path object containing information about the path.
 * @return {IResponse} The response object from the routed request.
 */
async function routeOne(
  routeObject: IRoute,
  pathObject: IPath
): Promise<IResponse> {
  const juxt = juxtPaths(routeObject.path, pathObject.path).filter(isObject);
  const params = Object.assign({}, ...juxt);

  if (routeObject.methods) {
    if (pathObject.method) {
      return await routeObject.methods[pathObject.method](params);
    }
    // return await routeObject.methods[pathObject.method](params);
  }
  return routeObject.response
    ? routeObject.response(params)
    : { status: 404, body: "Not found" };
}

function routeOneSync(routeObject: IRoute, pathObject: IPath): IResponse {
  const juxt = juxtPaths(routeObject.path, pathObject.path).filter(isObject);
  const params = Object.assign({}, ...juxt);

  return routeObject.response
    ? routeObject.response(params)
    : { status: 404, body: "Not found" };
}

/**
 * Routes the given path object to the appropriate route based on the provided routes and method.
 *
 * @param {IRoute[]} routes - An array of route objects representing the available routes.
 * @param {IPath} pathObject - The path object containing the path and method to be routed.
 * @return {Promise<IResponse>} A promise that resolves to the response object for the routed path.
 */
export async function route(
  routes: IRoute[],
  pathObject: IPath
): Promise<IResponse> {
  const rt = routes.find(
    (r) =>
      match(r.path, pathObject.path) &&
      (r.methods
        ? r.methods[pathObject.method!]
        : typeof r.response === "function")
  );

  if (rt) {
    return await routeOne(rt, pathObject);
  }
  return { status: 404, body: "Not found" };
}

export function routeSync(routes: IRoute[], pathObject: IPath): IResponse {
  const rt = routes.find((r) => {
    return match(r.path, pathObject.path) && r.response;
  });

  if (rt) {
    return routeOneSync(rt, pathObject);
  }
  return { status: 404, body: "Not found" };
}
