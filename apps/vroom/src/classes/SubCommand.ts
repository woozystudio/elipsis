import { ChatInputCommandInteraction, CacheType } from "discord.js";
import ISubCommand from "../interfaces/SubCommand";
import VroomClient from "./Client";
import ISubCommandOptions from "../interfaces/SubCommandOptions";

export default class SubCommand implements ISubCommand {
    client: VroomClient;
    name: string;
    
    constructor(client: VroomClient, options: ISubCommandOptions){
        this.client = client;
        this.name = options.name;
    }

    Execute(interaction: ChatInputCommandInteraction<CacheType>): void {
    }

}