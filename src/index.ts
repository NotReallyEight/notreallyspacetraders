import { Rest } from "./rest/Rest";
import { Client } from "./Client";

const client = new Client();

void new Rest(client).get().then(console.log);
void new Rest(client).get().then(console.log);
void new Rest(client).get().then(console.log);
void new Rest(client).get().then(console.log);
