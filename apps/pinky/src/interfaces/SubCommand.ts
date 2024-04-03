import { ChatInputCommandInteraction } from "discord.js";
import PinkyClient from "../classes/Client";

export default interface ISubCommand {
    client: PinkyClient;
    name: string;

    Execute(interaction: ChatInputCommandInteraction): void;
}