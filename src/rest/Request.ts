import type { OutgoingHttpHeaders } from "http2";
import { request } from "https";
import type { Client } from "../Client";
import type { RequestOptions, Response } from "../types";
import { RequestStatus, Reference } from "../types";

/**
 * A request to the REST API
 */
export class Request {
	/**
	 * The client that instantiated the request
	 */
	client: Client;
	/**
	 * The headers of the request
	 */
	headers?: OutgoingHttpHeaders;
	/**
	 * The method of the request
	 */
	method: "DELETE" | "GET" | "POST" | "PUT";
	/**
	 * The status of the request
	 */
	status = RequestStatus.InProgress;
	/**
	 * The status code of the request
	 */
	statusCode?: number;
	/**
	 * The URL of the request
	 */
	url: string;
	/**
	 *
	 * @param options - The options of the request
	 */
	constructor({ client, headers, method, url }: RequestOptions) {
		this.headers = headers;
		this.method = method;
		this.url = url;
		this.client = client;
	}

	/**
	 * Sends a request to the REST API
	 * @returns - The response of the request
	 */
	async send(): Promise<Response> {
		await this.client.rest.queue.wait();

		try {
			if (this.method === "GET") this.headers = undefined;

			return await new Promise<Response>((resolve, reject) => {
				this.status = RequestStatus.InProgress;
				this.handleRequest(resolve, reject);
			});
		} catch (err) {
			throw new Error(`${(err as Error).name}: ${(err as Error).message}`);
		} finally {
			this.client.rest.queue.shift();
		}
	}

	/**
	 * Handles the request
	 * @param resolve - The resolve function of the promise
	 * @param reject - The reject function of the promise
	 */
	private handleRequest(
		resolve: (value: PromiseLike<Response> | Response) => void,
		reject: (reason?: any) => void
	): void {
		let data = "";
		const req = request(
			{
				path: this.url.startsWith("/") ? this.url : `/${this.url}`,
				hostname: Reference.baseUrl,
				method: "GET",
			},
			(res) => {
				res.on("data", (d: string) => {
					data += d.toString();
				});

				res.once("end", () => {
					if (!res.complete) {
						this.status = RequestStatus.Failed;
						throw new Error("Request ended before it was completed.");
					}

					resolve({
						data: data || null,
						statusCode: res.statusCode!,
						headers: res.headers,
						status: res.statusMessage!,
						request: this,
					});

					this.status = RequestStatus.Finished;
				});
			}
		);

		req.once("error", (err) => {
			reject(new Error(`${err.name}: ${err.message}`));
			this.status = RequestStatus.Failed;
		});

		req.end();
	}
}
