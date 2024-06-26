import { ChatInputCommandInteraction, Collection, Events } from "discord.js";
import WorfClient from "../../classes/Client";
import Event from "../../classes/Event";
import Command from "../../classes/Command";
import Symbols from "../../enums/Symbols";

export default class InteractionCreate extends Event {
    constructor(client: WorfClient) {
        super(client, {
            name: Events.InteractionCreate,
            description: "InteractionCreate Event",
            once: false
        });
    }

    Execute(interaction: ChatInputCommandInteraction) {
        if(!interaction.isChatInputCommand()) return;

        const command: Command = this.client.commands.get(interaction.commandName)!;

        //@ts-ignore
        if(!command) return interaction.reply({ content: "outdated command", ephemeral: true }) && this.client.commands.delete(interaction.commandName);

        if(command.development && !this.client.config.developers.includes(interaction.user.id))
            return interaction.reply({ content: `${Symbols.Error} This command is only for developers!`, ephemeral: true });

        const { cooldowns } = this.client;
        if(!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

        const now = Date.now();
        const timestamps = cooldowns.get(command.name)!;
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if(timestamps.has(interaction.user.id) && (now < (timestamps.get(interaction.user.id) || 0) + cooldownAmount))
            return interaction.reply({ content: `${Symbols.Error} Please wait another \`${((((timestamps.get(interaction.user.id) || 0) + cooldownAmount) - now) / 1000).toFixed(1)}\` seconds to run this command.`, ephemeral: true })

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        try {
            const subCommandGroup = interaction.options.getSubcommandGroup(false);
            const subCommand = `${interaction.commandName}${subCommandGroup ? `.${subCommandGroup}`: ""}.${interaction.options.getSubcommand(false) || ""}`

            return this.client.subCommands.get(subCommand)?.Execute(interaction) || command.Execute(interaction);
        } catch (error) {
            console.log(error);
        }
    }
}