import EventEmitter from "node:events";
import { Rest } from "./rest/Rest";
import type {
	ClaimUsernameResponse,
	ClientOptions,
	GameStatus,
	GetUser,
	GetUserUser,
	RequestError,
} from "./types";

/**
 * The client class
 */
export class Client extends EventEmitter {
	token?: string;
	/**
	 * The REST handler of the client
	 */
	rest: Rest;

	/**
	 * @param options - The options of the client
	 */
	constructor(options: ClientOptions) {
		super();
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
	 * Determine whether the server is alive
	 * @returns - The status of the game
	 */
	async getGameStatus(): Promise<string | null> {
		const req = await this.rest.get({
			url: "/game/status",
		});

		if (req.data == null) return null;

		const data = JSON.parse(req.data) as GameStatus;

		return data.status;
	}
}
