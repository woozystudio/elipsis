import { ChatInputCommandInteraction, CacheType } from "discord.js";
import ISubCommand from "../interfaces/SubCommand";
import NellyClient from "./Client";
import ISubCommandOptions from "../interfaces/SubCommandOptions";

export default class SubCommand implements ISubCommand {
    client: NellyClient;
    name: string;
    
    constructor(client: NellyClient, options: ISubCommandOptions){
        this.client = client;
        this.name = options.name;
    }

    Execute(interaction: ChatInputCommandInteraction<CacheType>): void {
    }

}