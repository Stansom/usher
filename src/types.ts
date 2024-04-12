type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

type METHODS =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS"
  | "PATCH";

type PATH = string;
type URL = string;
type PATHORURL = PATH | URL;

type MethodFunctions = {
  [K in METHODS]: (...args: any) => IResponse | Promise<IResponse>;
};
interface IRoute {
  path: string;
  response?: (...args: any) => IResponse;
  methods?: AtLeastOne<MethodFunctions>;
  notFound?: () => IResponse;
}

interface IPath {
  path?: string;
  method?: string;
  url?: string;
}

interface IResponse {
  status: number;
  body: string;
  headers?: unknown;
  cookies?: unknown;
  contentType?: string;
  json?: unknown;
  pathParams?: unknown;
}

interface IRequest extends IPath {
  headers?: unknown;
  cookies?: unknown;
  queryParams?: unknown;
  body?: unknown;
  host?: unknown;
  ip?: unknown;
  protocol?: unknown;
  secure?: unknown;
  contentType?: unknown;
}

export type { IRoute, IPath, IResponse, MethodFunctions, IRequest };
