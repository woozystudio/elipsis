import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import FloopClient from "../classes/Client";
import Category from "../enums/Category";

export default interface ICommand {
    client: FloopClient;
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