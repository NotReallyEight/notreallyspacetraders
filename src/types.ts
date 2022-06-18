import type { IncomingHttpHeaders, OutgoingHttpHeaders } from "node:http2";
import type { Client } from "./Client";
import type { Request } from "./rest/Request";

export interface APIErrorResponse {
	message: string;
	code: number;
	data?: any;
}

export interface APIErrorOptions {
	error: APIErrorResponse;
}

/**
 * Loan information when getting available loans
 */
export interface AvailableLoan {
	amount: number;
	collateralRequired: boolean;
	rate: number;
	termInDays: number;
	type: string;
}

/**
 * The options for the client class
 */
export interface ClientOptions {
	/**
	 * The token of the client
	 */
	token?: string;
}

/**
 * The response to the claim username request
 */
export interface ClaimUsernameResponse {
	/**
	 * The token of the user
	 */
	token: string;
	/**
	 * The user information for the username claimed
	 */
	user: ClaimedUsernameUser;
}

/**
 * A user in the REST API
 */
export interface ClaimedUsernameUser {
	/**
	 * The username of the user
	 */
	username: string;
	/**
	 * The number of credits of the user
	 */
	credits: number;
	/**
	 * The ships of the user
	 */
	ships: any[];
	/**
	 * The loans of the user
	 */
	loans: any[];
}

/**
 * Represents the response to the gameStatus endpoint of the REST API
 */
export interface GameStatus {
	/**
	 * The status of the REST API
	 */
	status: string;
}

export interface GetAvailableLoans {
	loans: AvailableLoan[];
}

/**
 * The response to a getUser endpoint request
 */
export interface GetUser {
	/**
	 * The user in a getUser endpoint request's user property
	 */
	user: GetUserUser;
}

/**
 * The user in a getUser endpoint request's user property
 */
export interface GetUserUser {
	/**
	 * The number of credits of the user
	 */
	credits: number;
	/**
	 * The date the user joined the game in ISO format
	 */
	joinedAt: string;
	/**
	 * The number of ships the user owns
	 */
	shipCount: number;
	/**
	 * The number of structures the user owns
	 */
	structureCount: number;
	/**
	 * The username of the user
	 */
	username: string;
}

/**
 * A JSON object
 */
export type Json = Json[] | boolean | number | string | { [key: string]: Json };

/**
 * A loan
 */
export interface Loan {
	due: string;
	id: string;
	repaymentAmount: number;
	status: string;
	type: string;
}

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
 * The error of a request
 */
export interface RequestError {
	/**
	 * The error of the request
	 */
	error: {
		/**
		 * The error code
		 */
		code: number;
		/**
		 * The error message
		 */
		message: string;
	};
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

/**
 * The response of the takeOutLoan endpoint request
 */
export interface TakeOutLoan {
	credits: number;
	loan: Loan;
}
