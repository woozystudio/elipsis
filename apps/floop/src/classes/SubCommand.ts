import { ChatInputCommandInteraction, CacheType } from "discord.js";
import ISubCommand from "../interfaces/SubCommand";
import FloopClient from "./Client";
import ISubCommandOptions from "../interfaces/SubCommandOptions";

export default class SubCommand implements ISubCommand {
    client: FloopClient;
    name: string;
    
    constructor(client: FloopClient, options: ISubCommandOptions){
        this.client = client;
        this.name = options.name;
    }

    Execute(interaction: ChatInputCommandInteraction<CacheType>): void {
    }

}