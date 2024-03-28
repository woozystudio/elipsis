import { Client, GatewayIntentBits, Partials } from "discord.js";
import config from '../config/monitor.config.js';

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)],
});

client.login(config.bot.token);