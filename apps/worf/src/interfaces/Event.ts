import { Events } from "discord.js";
import WorfClient from "../classes/Client";

export default interface IEvent {
    client: WorfClient;
    name: Events;
    description: string;
    once: boolean;
}