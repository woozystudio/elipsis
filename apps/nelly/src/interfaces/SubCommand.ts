import { ChatInputCommandInteraction } from "discord.js";
import NellyClient from "../classes/Client";

export default interface ISubCommand {
    client: NellyClient;
    name: string;

    Execute(interaction: ChatInputCommandInteraction): void;
}