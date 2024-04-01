import { Events } from "discord.js";
import WumpusClient from "../classes/Client";

export default interface IEvent {
    client: WumpusClient;
    name: Events;
    description: string;
    once: boolean;
}