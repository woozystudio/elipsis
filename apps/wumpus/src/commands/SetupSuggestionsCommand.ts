import { ApplicationCommandOptionType, CategoryChannel, ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from "discord.js";
import WumpusClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import SuggestionSetup from "../database/models/Suggestion";
import Symbols from "../enums/Symbols";

export default class SuggestionSetupCommand extends Command {
    constructor(client: WumpusClient) {
        super(client, {
            name: "setup-suggestions",
            description: "Configures the suggestion system on the server.",
            category: Category.Utilities,
            userPermissions: PermissionFlagsBits.ManageGuild,
            dmPermissions: true,
            development: false,
            cooldown: 2,
            options: [
                {
                    name: "channel",
                    description: "Select the suggestion channel.",
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                    channel_types: [ChannelType.GuildText]
                },
                {
                    name: "ping",
                    description: "Select a role to be mentioned when creating a suggestion.",
                    type: ApplicationCommandOptionType.Role,
                    required: false
                }
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const suggestionChannel = interaction.options.getChannel('channel') as TextChannel;
        const pingrole = interaction.options.getRole('ping');

        try {            
            if(suggestionChannel && interaction.guild) {
                if(pingrole) {
                    const data = await SuggestionSetup.findOneAndUpdate({ GuildID: interaction.guild.id }, {
                        Channel: suggestionChannel.id,
                        Ping: pingrole.id
                    },
                    {
                        new: true,
                        upsert: true
                    });
                } else {
                    const data = await SuggestionSetup.findOneAndUpdate({ GuildID: interaction.guild.id }, {
                        Channel: suggestionChannel.id
                    },
                    {
                        new: true,
                        upsert: true
                    }); 
                }

                interaction.reply({ content: `${Symbols.Success} The suggestion system has been configured correctly!`, ephemeral: true });
            }
        } catch (err) {
            console.error(err);
            interaction.reply({ content: `${Symbols.Error} There was an error configuring the suggestion system.`, ephemeral: true });
        }
    }
}