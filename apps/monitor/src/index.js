const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { EventsLoader } = require('./handlers/EventHandler.js');
const { CommandsLoader } = require('./handlers/CommandHandler.js');
const config = require('../../../config/monitor.config.js');

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)],
});

client.commands = new Collection();
client.commandArray = [];

client.login(config.bot.token).then(() => {
    EventsLoader(client);
    CommandsLoader(client);
});