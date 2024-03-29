const { REST, Routes } = require('discord.js');
const config  = require('../../config/monitor.config.js');
const fs = require('fs');
require('colors');

async function CommandsLoader(client) {
    const commandFolders = fs.readdirSync(`./src/commands`);
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith('.js'));

            const { commands, commandArray } = client;
            for (const file of commandFiles) {

                const command = require(`../commands/${folder}/${file}`);

                commands.set(command.data.name, command);

                commandArray.push(command.data.toJSON());

                console.log(`${"(#)".magenta} ${command.data.name.magenta} command loaded.`);
            }
        }

        const rest = new REST({ version: "9" }).setToken(config.bot.token);
        try {
            // console.log('Start reistering application slash commands...');
            
            await rest.put(Routes.applicationCommands(config.bot.id), {
                body: client.commandArray,
            });

            // console.log('Sucessfully registered application slash commands.');
        } catch (error) {
            console.error(error)
        }
}

module.exports = { CommandsLoader };