import type { IncomingHttpHeaders, OutgoingHttpHeaders } from "node:http2";
import type { Client } from "./Client";
import type { Request } from "./rest/Request";

/**
 * A JSON object
 */
export type Json = Json[] | boolean | number | string | { [key: string]: Json };

/**
 * A reference to a REST resource
 */
export enum Reference {
	/**
	 * The base URL of the REST API
	 */
	baseUrl = "api.spacetraders.io",
}

/**
 * The method of a request
 */
export type RequestMethod = "DELETE" | "GET" | "POST" | "PUT";

/**
 * The options of a request
 */
export interface RequestOptions {
	/**
	 * The body of a request
	 */
	body?: Json;
	/**
	 * The client that instantiated the request
	 */
	client: Client;
	/**
	 * The headers of the request
	 */
	headers?: OutgoingHttpHeaders;
	/**
	 * The URL of the request
	 */
	url: string;
}

/**
 * The status of a request
 */
export enum RequestStatus {
	Failed,
	Finished,
	InProgress,
}

/**
 * The response of a request
 */
export interface Response {
	/**
	 * The data of the response
	 */
	data: string | null;
	/**
	 * The headers of the request
	 */
	headers: IncomingHttpHeaders;
	/**
	 * The request
	 */
	request: Request;
	/**
	 * The status message of the response
	 */
	status: string;
	/**
	 * The status code of the response
	 */
	statusCode: number;
}
