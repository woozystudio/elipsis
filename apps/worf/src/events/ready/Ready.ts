import { Events } from "discord.js";
import WorfClient from "../../classes/Client";
import Event from "../../classes/Event";

export default class Ready extends Event {
    constructor(client: WorfClient) {
        super(client, {
            name: Events.ClientReady,
            description: "Ready Event",
            once: true
        })
    }

    Execute() {
        console.log(`Logged in ${this.client.user?.tag}.`)
    }
}