import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import NellyClient from "../classes/Client";
import Category from "../enums/Category";

export default interface ICommand {
    client: NellyClient;
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