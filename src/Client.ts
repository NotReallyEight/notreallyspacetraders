import EventEmitter from "node:events";
import { Rest } from "./rest/Rest";

export class Client extends EventEmitter {
	rest: Rest;
	constructor() {
		super();
		this.rest = new Rest(this);
	}
}
