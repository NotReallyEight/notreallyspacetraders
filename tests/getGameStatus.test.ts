import { Client } from "../src";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
	token: process.env.TOKEN,
});

test("Get Game Status", async () => {
	const response = await client.getGameStatus();

	if (!response)
		throw new Error("Game status is offline or has thrown an error");

	expect(typeof response).toBe("string");
});
