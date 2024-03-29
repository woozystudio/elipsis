import { ChatInputCommandInteraction } from "discord.js";
import WorfClient from "../classes/Client";

export default interface ISubCommand {
    client: WorfClient;
    name: string;

    Execute(interaction: ChatInputCommandInteraction): void;
}