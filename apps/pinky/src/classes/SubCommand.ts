import { ChatInputCommandInteraction, CacheType } from "discord.js";
import ISubCommand from "../interfaces/SubCommand";
import PinkyClient from "./Client";
import ISubCommandOptions from "../interfaces/SubCommandOptions";

export default class SubCommand implements ISubCommand {
    client: PinkyClient;
    name: string;
    
    constructor(client: PinkyClient, options: ISubCommandOptions){
        this.client = client;
        this.name = options.name;
    }

    Execute(interaction: ChatInputCommandInteraction<CacheType>): void {
    }

}