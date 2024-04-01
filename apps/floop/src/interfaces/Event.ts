import { Events } from "discord.js";
import FloopClient from "../classes/Client";

export default interface IEvent {
    client: FloopClient;
    name: Events;
    description: string;
    once: boolean;
}