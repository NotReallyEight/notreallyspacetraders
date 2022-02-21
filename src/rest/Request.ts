import type { OutgoingHttpHeaders } from "http2";
import { request } from "https";
import type { Client } from "../Client";
import type { Json, RequestMethod, RequestOptions, Response } from "../types";
import { RequestStatus, Reference } from "../types";
import { join } from "node:path";
const { name, version } = require(join(
	__dirname,
	"..",
	"..",
	"package.json"
)) as { [key: string]: any; name: string; version: string };

/**
 * A request to the REST API
 */
export class Request {
	/**
	 * The body of the request
	 */
	body?: Json;
	/**
	 * The client that instantiated the request
	 */
	client: Client;
	/**
	 * The headers of the request
	 */
	headers: OutgoingHttpHeaders;
	/**
	 * The method of the request
	 */
	method: RequestMethod;
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
	constructor(method: RequestMethod, options: RequestOptions) {
		this.headers = {
			...options.headers,
			"Content-Type": "application/json",
			"User-Agent": `${name}/${version}`,
		};
		this.method = method;
		this.url = options.url;
		this.client = options.client;
		this.body = options.body;
	}

	/**
	 * Sends a request to the REST API
	 * @returns - The response of the request
	 */
	async send(): Promise<Response> {
		await this.client.rest.queue.wait();

		try {
			if (this.method === "GET" && this.body !== undefined)
				throw new Error("GET requests cannot have a body.");

			return await new Promise<Response>((resolve, reject) => {
				this.status = RequestStatus.InProgress;
				this.handleRequest(resolve, reject);
			});
		} catch (err) {
			throw new Error((err as Error).message);
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
				method: this.method,
				headers: this.headers,
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

		if (this.body !== undefined) req.write(JSON.stringify(this.body));

		req.end();
	}
}
