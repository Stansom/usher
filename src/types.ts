type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

type METHODS = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type MethodFunctions = {
	[K in METHODS]: (...args: any) => IResponse | Promise<IResponse>;
};
interface IRoute {
	path: string;
	response?: (...args: any) => IResponse;
	methods?: AtLeastOne<MethodFunctions>;
}

interface IPath {
	path: string;
	method?: string;
}

interface IResponse {
	status: number;
	body: string;
	headers?: unknown;
	cookies?: unknown;
	contentType?: string;
	json?: unknown;
}

export type { IRoute, IPath, IResponse, MethodFunctions };
