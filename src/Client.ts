import EventEmitter from "node:events";
import { Rest } from "./rest/Rest";
import type { GameStatus } from "./types";

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
