const { Client, Events, ActivityType, PresenceUpdateStatus } = require('discord.js');
require('colors');

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * @param {Client} client 
     */
    async execute(client) {
        console.log(`Logged as ${client.user.tag}.`.green);
        client.user.setPresence({ activities: [{ name: "woozystudio.com", type: ActivityType.Custom }] })
    }
}