import { ChatInputCommandInteraction } from "discord.js";
import FloopClient from "../classes/Client";

export default interface ISubCommand {
    client: FloopClient;
    name: string;

    Execute(interaction: ChatInputCommandInteraction): void;
}