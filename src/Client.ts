import { Rest } from "./rest/Rest";
import type {
	ClaimUsernameResponse,
	ClientOptions,
	GameStatus,
	GetAvailableLoans,
	GetUser,
	GetUserUser,
	RequestError,
	TakeOutLoan,
} from "./types";

/**
 * The client class
 */
export class Client {
	token?: string;
	/**
	 * The REST handler of the client
	 */
	rest: Rest;

	/**
	 * @param options - The options of the client
	 */
	constructor(options: ClientOptions) {
		this.token = options.token;
		this.rest = new Rest(this);
	}

	/**
	 * Claim a username and get a token
	 * @param username - The username to claim
	 * @returns - The user and token
	 */
	async claimUsername(username: string): Promise<ClaimUsernameResponse | null> {
		const req = await this.rest.post({
			url: `/users/${encodeURI(username)}/claim`,
		});

		if (req.data == null) return null;

		const data = JSON.parse(req.data) as ClaimUsernameResponse | RequestError;

		if ("error" in data)
			throw new Error(
				`Request exited with code ${data.error.code}: ${data.error.message}`
			);

		return data;
	}

	/**
	 * Gets an account's information
	 * @param token - The token of the user
	 * @returns The user's information, or null if the user is not found
	 */
	async getAccount(token = this.token): Promise<GetUserUser | null> {
		if (token === undefined) throw new Error("No token provided.");

		const req = await this.rest.get({
			url: "/my/account",
			headers: {
				Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
			},
		});

		if (req.data == null) return null;

		const data = JSON.parse(req.data) as GetUser | RequestError;

		if ("error" in data) throw new Error(data.error.message);

		return data.user;
	}

	/**
	 * Get the available loans
	 * @param token - The token of the user
	 * @returns - The available loans
	 */
	async getAvailableLoans(
		token = this.token
	): Promise<GetAvailableLoans | null> {
		const req = await this.rest.get({
			url: "/types/loans",
			headers: {
				Authorization: token != null ? `Bearer ${token}` : undefined,
			},
		});

		if (req.data == null) return null;

		const data = JSON.parse(req.data) as GetAvailableLoans;

		return data;
	}

	/**
	 * Determine whether the server is alive
	 * @returns - The status of the game
	 */
	async getGameStatus(): Promise<string | null> {
		const req = await this.rest.get({
			url: "/game/status",
		});

		if (req.data == null) return null;

		const data = JSON.parse(req.data) as GameStatus | RequestError;

		if ("error" in data)
			throw new APIError(
				`Request exited with code ${data.error.code}: ${data.error.message}`,
				data
			);

		return data.status;
	}

	/**
	 * Take out a loan
	 * @param token - The token of the user
	 * @returns - The loan taken out
	 */
	async takeOutLoan(token = this.token): Promise<TakeOutLoan | null> {
		const req = await this.rest.post({
			url: `/my/loans`,
			headers: {
				Authorization: token != null ? `Bearer ${token}` : undefined,
			},
			body: {
				type: "STARTUP",
			},
		});

		if (req.data == null) return null;

		const data = JSON.parse(req.data) as RequestError | TakeOutLoan;

		if ("error" in data)
			throw new APIError(
				`Request exited with code ${data.error.code}: ${data.error.message}`,
				data
			);

		return data;
	}
}
