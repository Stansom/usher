import { route, routeSync } from "../index";
import type { IRoute, IPath, IResponse } from "../types.js";

describe("routeSync", () => {
  // Should return a valid response when a matching route with a response is found
  it("should return a valid response when a matching route with a response is found", () => {
    const routes: IRoute[] = [
      {
        path: "/users/:id",
        response: (params) => {
          return {
            status: 200,
            body: `User ${params.id} found`,
          };
        },
      },
      {
        path: "/users",
        response: () => {
          return {
            status: 200,
            body: "All users found",
          };
        },
      },
    ];

    const pathObject: IPath = {
      path: "/users/123",
      method: "GET",
    };

    const expectedResponse: IResponse = {
      status: 200,
      body: "User 123 found",
    };

    const actualResponse = routeSync(routes, pathObject);

    expect(actualResponse).toEqual(expectedResponse);
  });

  // Should handle empty routes correctly
  it("should handle empty routes correctly", () => {
    const routes: IRoute[] = [];

    const pathObject: IPath = {
      path: "/users",
      method: "GET",
    };

    const expectedResponse: IResponse = {
      status: 404,
      body: "Not found",
    };

    const actualResponse = routeSync(routes, pathObject);

    expect(actualResponse).toEqual(expectedResponse);
  });

  // Should return a 404 response when no matching route is found
  it("should return a 404 response when no matching route is found", () => {
    const routes: IRoute[] = [
      {
        path: "/users/:id",
        response: (params) => {
          return {
            status: 200,
            body: `User ${params.id} found`,
          };
        },
      },
      {
        path: "/users",
        response: () => {
          return {
            status: 200,
            body: "All users found",
          };
        },
      },
    ];

    const pathObject: IPath = {
      path: "/posts",
      method: "GET",
    };

    const expectedResponse: IResponse = {
      status: 404,
      body: "Not found",
    };

    const actualResponse = routeSync(routes, pathObject);

    expect(actualResponse).toEqual(expectedResponse);
  });

  // Should handle routes with optional parameters correctly
  it("should handle routes with optional parameters correctly", () => {
    const routes: IRoute[] = [
      {
        path: "/users/:id?",
        response: (params) => {
          if (params.id) {
            return {
              status: 200,
              body: `User ${params.id} found`,
            };
          } else {
            return {
              status: 200,
              body: "All users found",
            };
          }
        },
      },
    ];

    const pathObject1: IPath = {
      path: "/users",
      method: "GET",
    };

    const pathObject2: IPath = {
      path: "/users/123",
      method: "GET",
    };

    const expectedResponse1: IResponse = {
      status: 200,
      body: "All users found",
    };

    const expectedResponse2: IResponse = {
      status: 200,
      body: "User 123 found",
    };

    const actualResponse1 = routeSync(routes, pathObject1);
    const actualResponse2 = routeSync(routes, pathObject2);

    expect(actualResponse1).toEqual(expectedResponse1);
    expect(actualResponse2).toEqual(expectedResponse2);
  });

  it("should handle routes with optional parameters correctly", () => {
    const routes: IRoute[] = [
      {
        path: "/users/:id?",
        response: (params) => {
          if (params.id) {
            return {
              status: 200,
              body: `User ${params.id} found`,
            };
          } else {
            return {
              status: 200,
              body: "All users found",
            };
          }
        },
      },
    ];

    const pathObject1: IPath = {
      path: "/users",
      method: "GET",
    };

    const pathObject2: IPath = {
      path: "/users/123",
      method: "GET",
    };

    const expectedResponse1: IResponse = {
      status: 200,
      body: "All users found",
    };

    const expectedResponse2: IResponse = {
      status: 200,
      body: "User 123 found",
    };

    const actualResponse1 = routeSync(routes, pathObject1);
    const actualResponse2 = routeSync(routes, pathObject2);

    expect(actualResponse1).toEqual(expectedResponse1);
    expect(actualResponse2).toEqual(expectedResponse2);
  });

  // Should handle routes with multiple parameters correctly
  it("should handle routes with multiple parameters correctly", () => {
    const routes: IRoute[] = [
      {
        path: "/users/:id/posts/:postId",
        response: (params) => {
          return {
            status: 200,
            body: `Post ${params.postId} of User ${params.id} found`,
          };
        },
      },
    ];

    const pathObject: IPath = {
      path: "/users/123/posts/456",
      method: "GET",
    };

    const expectedResponse: IResponse = {
      status: 200,
      body: "Post 456 of User 123 found",
    };

    const actualResponse = routeSync(routes, pathObject);

    expect(actualResponse).toEqual(expectedResponse);
  });

  it("should handle react routes correctly", () => {
    const routes: IRoute[] = [
      {
        path: "/users/:id/posts/:postId",
        response: (params) => {
          return {
            status: 200,
            body: `Post ${params.postId} of User ${params.id} found`,
          };
        },
      },
      {
        path: "/",
        response: () => {
          return {
            status: 200,
            body: "Main func",
          };
        },
      },
    ];

    const actualResponse = routeSync(routes, {
      path: "/users/123/posts/456/",
    });
    const actualResponse2 = routeSync(routes, {
      path: "",
    });

    const expectedResponse: IResponse = {
      status: 200,
      body: "Post 456 of User 123 found",
    };
    const expectedResponse2: IResponse = {
      status: 200,
      body: "Main func",
    };

    expect(actualResponse).toEqual(expectedResponse);
    expect(actualResponse2).toEqual(expectedResponse2);
  });
});

describe("route function", () => {
  it("should return a response object when a valid route and method are provided", async () => {
    const routes: IRoute[] = [
      {
        path: "/users/:id",
        methods: {
          GET: (params) => {
            return { status: 200, body: `User ${params.id} found` };
          },
        },
      },
    ];
    const pathObject: IPath = {
      path: "/users/123",
      method: "GET",
    };

    const result = await route(routes, pathObject);

    expect(result).toEqual({ status: 200, body: "User 123 found" });
  });

  // Should handle route paths with empty strings
  it("should handle route paths with empty strings", async () => {
    const routes: IRoute[] = [
      {
        path: "",
        response: () => {
          return { status: 200, body: "Empty route" };
        },
      },
    ];
    const pathObject: IPath = {
      path: "",
      method: "GET",
    };

    const result = await route(routes, pathObject);

    expect(result).toEqual({ status: 200, body: "Empty route" });
  });
});
