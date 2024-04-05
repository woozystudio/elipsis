import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";
import NellyClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";
import Symbols from "../enums/Symbols";

export default class LockCommand extends Command {
    constructor(client: NellyClient) {
        super(client, {
            name: "lock",
            description: "Locks a text channel for server members.",
            category: Category.Utilities,
            userPermissions: PermissionFlagsBits.ManageChannels,
            dmPermissions: true,
            development: false,
            cooldown: 2,
            options: [
                {
                    name: "channel",
                    description: "Select the channel you want to lock.",
                    required: true,
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildText]
                }
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const channel = interaction.options.getChannel('channel') as TextChannel;
        const everyone = interaction.guild?.roles.everyone;
        
        if(channel && everyone && interaction.guild) {
            channel.permissionOverwrites.edit(everyone.id, { CreatePublicThreads: false, AddReactions: false, SendMessages: false });

            const LockEmbed = new EmbedBuilder()
            .setColor(Color.Success)
            .setDescription(`${Symbols.Success} The channel ${channel} has been successfully locked.`)
    
            interaction.reply({ embeds: [LockEmbed] });
            
        } else {
            throw new Error("CommandError: An error occurred in Lock command.")
        }
    }
}