import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import NellyClient from "../classes/Client";
import Category from "../enums/Category";

export default interface ICommand {
    client: NellyClient;
    name: string;
    description: string;
    category: Category;
    options: object;
    default_member_permissions: bigint;
    dm_permissions: boolean;
    cooldown: number;
    development: boolean;

    Execute(interaction: ChatInputCommandInteraction): void;
    AutoComplete(interaction: AutocompleteInteraction): void;
}