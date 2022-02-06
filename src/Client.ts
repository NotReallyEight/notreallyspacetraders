import EventEmitter from "node:events";
import { Rest } from "./rest/Rest";
import type { ClaimUsernameResponse, GameStatus, RequestError } from "./types";

/**
 * The client class
 */
export class Client extends EventEmitter {
	/**
	 * The REST handler of the client
	 */
	rest: Rest;

	constructor() {
		super();
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

		if (data.type === "error")
			throw new Error(
				`Request exited with code ${data.error.code}: ${data.error.message}`
			);

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

		const data = JSON.parse(req.data) as GameStatus;

		return data.status;
	}
}
