import { Client } from "discord.js";
import IClient from "../interfaces/Client";
import IConfig from "../interfaces/Config";
import Handler from "./Handler";

export default class WorfClient extends Client implements IClient
{
    handler: Handler;
    config: IConfig;

    constructor()
    {
        super({ 
            intents: [] 
        });

        this.config = require(`../../../../config/worf.config.json`);
        this.handler = new Handler(this);
    }

    Init(): void {
        this.LoadHandlers();

        this.login(this.config.token).catch((err) => console.error(err));
    }

    LoadHandlers(): void {
        this.handler.LoadEvents();
    }
}