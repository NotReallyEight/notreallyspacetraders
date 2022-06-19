import { Client } from "../src";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
	token: process.env.API_TOKEN,
});

test("Get System Available Ships", async () => {
	const response = await client.getSystemAvailableShips("OE");

	if (!response) throw new Error("System is offline or has thrown an error");

	expect(Array.isArray(response.shipListings)).toBeTruthy();

	for (let i = 0; i < response.shipListings.length; i++) {
		const shipListing = response.shipListings[i];

		expect(typeof shipListing.class).toBe("string");
		expect(typeof shipListing.manufacturer).toBe("string");
		expect(shipListing.maxCargo).toBeGreaterThanOrEqual(0);
		expect(shipListing.plating).toBeGreaterThanOrEqual(0);
		expect(Array.isArray(shipListing.purchaseLocations)).toBeTruthy();

		for (let j = 0; j < shipListing.purchaseLocations.length; j++) {
			const purchaseLocation = shipListing.purchaseLocations[j];

			expect(typeof purchaseLocation.location).toBe("string");
			expect(purchaseLocation.price).toBeGreaterThanOrEqual(0);
			expect(typeof purchaseLocation.system).toBe("string");
		}

		expect(shipListing.speed).toBeGreaterThanOrEqual(0);
		expect(typeof shipListing.type).toBe("string");
		expect(shipListing.weapons).toBeGreaterThanOrEqual(0);
	}
});
