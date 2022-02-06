import { AsyncQueue } from "@sapphire/async-queue";
import type { Client } from "../Client";
import { Request } from "./Request";
import type { Response, RequestOptions, Json, RequestMethod } from "../types";

/**
 * A class representing a REST handler
 */
export class Rest {
	/**
	 * The client that instantiated the class
	 */
	client: Client;
	/**
	 * The queue of the requests to be handled
	 */
	queue = new AsyncQueue();

	/**
	 * @param client - The client that instantiated the class
	 */
	constructor(client: Client) {
		this.client = client;
	}

	/**
	 * Sends a GET request to the REST API
	 * @param options - The options of the request
	 * @returns - The response of the request
	 */
	get<T>(options: RequestOptions): Promise<T> {
		return this.request("GET", options);
	}

	/**
	 * Sends a POST request to the REST API
	 * @param options - The options of the request
	 * @returns - The response of the request
	 */
	post<T>(options: RequestOptions): Promise<T> {
		return this.request("POST", options);
	}

	/**
	 * Sends a request to the REST API
	 * @param method - The method of the request
	 * @param options - The options of the request
	 */
	request<T = Json | null>(
		method: "GET",
		options: Omit<RequestOptions, "body">
	): Promise<T>;
	request<T = Json | null>(
		method: Exclude<RequestMethod, "GET">,
		options: RequestOptions
	): Promise<T>;
	async request(
		method: RequestMethod,
		options: RequestOptions
	): Promise<Response> {
		return new Request(method, {
			...options,
		}).send();
	}
}
