import { ChatInputCommandInteraction, CacheType } from "discord.js";
import ISubCommand from "../interfaces/SubCommand";
import WumpusClient from "./Client";
import ISubCommandOptions from "../interfaces/SubCommandOptions";

export default class SubCommand implements ISubCommand {
    client: WumpusClient;
    name: string;
    
    constructor(client: WumpusClient, options: ISubCommandOptions){
        this.client = client;
        this.name = options.name;
    }

    Execute(interaction: ChatInputCommandInteraction<CacheType>): void {
    }

}