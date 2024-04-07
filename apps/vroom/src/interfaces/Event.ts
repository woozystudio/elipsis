import { Events } from "discord.js";
import VroomClient from "../classes/Client";

export default interface IEvent {
    client: VroomClient;
    name: Events;
    description: string;
    once: boolean;
}