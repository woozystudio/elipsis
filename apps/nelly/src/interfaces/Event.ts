import { Events } from "discord.js";
import NellyClient from "../classes/Client";

export default interface IEvent {
    client: NellyClient;
    name: Events;
    description: string;
    once: boolean;
}