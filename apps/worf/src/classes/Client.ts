import { Client } from "discord.js";
import IClient from "../interfaces/Client";
import IConfig from "../interfaces/Config";

export default class WorfClient extends Client implements IClient
{
    config: IConfig;

    constructor()
    {
        super({ 
            intents: [] 
        });

        this.config = require(`../../../../config/worf.config.json`);
    }

    Init(): void {
        this.login(this.config.token)
            .then(() => console.log("Logged in!"))
            .catch((err) => console.error(err));
    }
}