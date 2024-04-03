import { Events } from "discord.js";
import PinkyClient from "../classes/Client";

export default interface IEvent {
    client: PinkyClient;
    name: Events;
    description: string;
    once: boolean;
}