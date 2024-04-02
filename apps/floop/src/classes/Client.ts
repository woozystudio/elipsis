import { Client, Collection, GatewayIntentBits } from "discord.js";
import IClient from "../interfaces/Client";
import IConfig from "../interfaces/Config";
import Handler from "./Handler";
import Command from "./Command";
import SubCommand from "./SubCommand";
import { connect } from "mongoose";
import 'colors';

export default class FloopClient extends Client implements IClient
{
    handler: Handler;
    config: IConfig;
    commands: Collection<string, Command>;
    subCommands: Collection<string, SubCommand>;
    cooldowns: Collection<string, Collection<string, number>>;
    development: boolean;

    constructor()
    {
        super({ 
            intents: [
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent
            ] 
        });

        this.config = require(`../../../../config/floop.config.json`);
        this.handler = new Handler(this);
        this.commands = new Collection();
        this.subCommands = new Collection();
        this.cooldowns = new Collection();
        this.development = (process.argv.slice(2).includes("--development"));
    }

    Init(): void {
        console.log(`Starting the client in ${this.development ? "development" : "production"} mode.`.cyan)
        this.LoadHandlers();

        this.login(this.development ? this.config.developmentToken : this.config.token).catch((err) => console.error(err));

        connect(this.development ? this.config.developmentMongooseURL : this.config.mongooseURL)
            .then(() => console.log("☁ Connected to MongoDB database successfully.".blue))
            .catch((err) => console.error(err));
    }

    LoadHandlers(): void {
        this.handler.LoadEvents();
        this.handler.LoadCommands();
    }
}