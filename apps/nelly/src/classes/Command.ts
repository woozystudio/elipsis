import { ChatInputCommandInteraction, CacheType, AutocompleteInteraction } from "discord.js";
import Category from "../enums/Category";
import ICommand from "../interfaces/Command";
import NellyClient from "./Client";
import ICommandOptions from "../interfaces/CommandOptions";

export default class Command implements ICommand {
    client: NellyClient;
    name: string;
    description: string;
    category: Category;
    options: object;
    userPermissions: bigint;
    dmPermissions: boolean;
    cooldown: number;
    development: boolean;

    constructor(client: NellyClient, options: ICommandOptions) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.category = options.category;
        this.options = options.options;
        this.userPermissions = options.userPermissions;
        this.dmPermissions = options.dmPermissions;
        this.cooldown = options.cooldown;
        this.development = options.development;
    }

    Execute(interaction: ChatInputCommandInteraction<CacheType>): void {
    }
    AutoComplete(interaction: AutocompleteInteraction<CacheType>): void {
    }
    
}