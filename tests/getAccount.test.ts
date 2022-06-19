import { Client } from "../src";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env);

const client = new Client({
	token: process.env.API_TOKEN,
});

test("Get Account", async () => {
	const account = await client.getAccount();

	if (!account) throw new Error("Account not found");

	expect(account.username).toBe("NotReallyEight");
	expect(account.credits).toBeGreaterThanOrEqual(0);
	expect(account.joinedAt).toMatch(
		/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
	);
	expect(account.shipCount).toBeGreaterThanOrEqual(0);
	expect(account.structureCount).toBeGreaterThanOrEqual(0);
});
