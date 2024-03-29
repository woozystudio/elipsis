import { Events } from "discord.js";
import IEvent from "../interfaces/Event";
import WorfClient from "./Client";
import IEventOptions from "../interfaces/EventOptions";

export default class Event implements IEvent {
    client: WorfClient;
    name: Events;
    description: string;
    once: boolean;
    
    constructor(client: WorfClient, options: IEventOptions) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.once = options.once;
    }

    Execute(...args: any): void {};
}