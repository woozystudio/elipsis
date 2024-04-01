import { ChatInputCommandInteraction } from "discord.js";
import WumpusClient from "../classes/Client";

export default interface ISubCommand {
    client: WumpusClient;
    name: string;

    Execute(interaction: ChatInputCommandInteraction): void;
}