import { Client, Collection } from "discord.js";
import IClient from "../interfaces/Client";
import IConfig from "../interfaces/Config";
import Handler from "./Handler";
import Command from "./Command";
import SubCommand from "./SubCommand";

export default class WorfClient extends Client implements IClient
{
    handler: Handler;
    config: IConfig;
    commands: Collection<string, Command>;
    subCommands: Collection<string, SubCommand>;
    cooldowns: Collection<string, Collection<string, number>>;

    constructor()
    {
        super({ 
            intents: [] 
        });

        this.config = require(`../../../../config/worf.config.json`);
        this.handler = new Handler(this);
        this.commands = new Collection();
        this.subCommands = new Collection();
        this.cooldowns = new Collection();
    }

    Init(): void {
        this.LoadHandlers();

        this.login(this.config.token).catch((err) => console.error(err));
    }

    LoadHandlers(): void {
        this.handler.LoadEvents();
        this.handler.LoadCommands();
    }
}