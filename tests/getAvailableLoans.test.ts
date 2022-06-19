import { Client } from "../src";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
	token: process.env.API_TOKEN,
});

test("Get Available Loans", async () => {
	const response = await client.getAvailableLoans();

	if (!response) throw new Error("Loans not found");

	expect(response.loans).toBeTruthy();
	for (let i = 0; i < response.loans.length; i++) {
		expect(response.loans[i].amount).toBeGreaterThanOrEqual(0);
		expect(typeof response.loans[i].collateralRequired).toBe("boolean");
		expect(response.loans[i].rate).toBeGreaterThanOrEqual(0);
		expect(response.loans[i].termInDays).toBeGreaterThanOrEqual(0);
		expect(typeof response.loans[i].type).toBe("string");
	}
});
