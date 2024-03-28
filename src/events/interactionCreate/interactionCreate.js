const { ChatInputCommandInteraction, Client, Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    /**
    * @param {ChatInputCommandInteraction} interaction 
    * @param {Client} client 
    */
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return interaction.reply({ content: `outdated command` });

            command.execute(interaction, client);
        } else if (interaction.isUserContextMenuCommand()) {

            const contextCommand = client.commands.get(interaction.commandName);
            if(!contextCommand) return;
            
            try {
                await contextCommand.execute(interaction, client);
            } catch (error) {
                console.error(error)
            }
        }


    }
}