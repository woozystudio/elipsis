import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import WumpusClient from "../classes/Client";
import Category from "../enums/Category";

export default interface ICommand {
    client: WumpusClient;
    name: string;
    description: string;
    category: Category;
    options: object;
    userPermissions: bigint;
    dmPermissions: boolean;
    cooldown: number;
    development: boolean;

    Execute(interaction: ChatInputCommandInteraction): void;
    AutoComplete(interaction: AutocompleteInteraction): void;
}