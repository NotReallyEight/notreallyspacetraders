import { AsyncQueue } from "@sapphire/async-queue";
import type { Client } from "../Client";
import { Request } from "./Request";
import type { Response, RequestOptions, RequestMethod } from "../types";

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
	get(options: Omit<RequestOptions, "client">): Promise<Response> {
		return this.request("GET", options);
	}

	/**
	 * Sends a POST request to the REST API
	 * @param options - The options of the request
	 * @returns - The response of the request
	 */
	post(options: Omit<RequestOptions, "client">): Promise<Response> {
		return this.request("POST", options);
	}

	/**
	 * Sends a request to the REST API
	 * @param method - The method of the request
	 * @param options - The options of the request
	 */
	request(
		method: "GET",
		options: Omit<RequestOptions, "body" | "client">
	): Promise<Response>;
	request(
		method: Exclude<RequestMethod, "GET">,
		options: Omit<RequestOptions, "client">
	): Promise<Response>;
	async request(
		method: RequestMethod,
		options: Omit<RequestOptions, "client">
	): Promise<Response> {
		return new Request(method, {
			client: this.client,
			...options,
		}).send();
	}
}
