import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import WorfClient from "../classes/Client";
import Category from "../enums/Category";

export default interface ICommand {
    client: WorfClient;
    name: string;
    description: string;
    category: Category;
    options: object;
    userPermissions: bigint;
    dmPermissions: boolean;
    cooldown: number;

    Execute(interaction: ChatInputCommandInteraction): void;
    AutoComplete(interaction: AutocompleteInteraction): void;
}