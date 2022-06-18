import type { APIErrorOptions, APIErrorResponse } from "../types";

/**
 * Represents an error from the REST API
 */
export class APIError extends Error {
	/**
	 * The error response from the REST API
	 */
	error: APIErrorResponse;
	/**
	 * @param message - The message of the error
	 * @param options - The options of the error
	 */
	constructor(message: string, options: APIErrorOptions) {
		super(message);
		this.error = options.error;
	}
}
