import { ChatInputCommandInteraction } from "discord.js";
import VroomClient from "../classes/Client";

export default interface ISubCommand {
    client: VroomClient;
    name: string;

    Execute(interaction: ChatInputCommandInteraction): void;
}