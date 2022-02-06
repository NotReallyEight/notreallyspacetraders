import { AsyncQueue } from "@sapphire/async-queue";
import type { Client } from "../Client";
import { Request } from "./Request";
import type { Response, RequestOptions } from "../types";

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

	constructor(client: Client) {
		this.client = client;
	}

	/**
	 * Sends a GET request
	 * @returns - A response to the request
	 */
	async get({ url }: RequestOptions): Promise<Response> {
		const request = new Request({
			client: this.client,
			method: "GET",
			url,
		});

		const response = await request.send();
		return response;
	}
}
