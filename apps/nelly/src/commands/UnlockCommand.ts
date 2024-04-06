import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";
import NellyClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";
import Symbols from "../enums/Symbols";

export default class UnlockCommand extends Command {
    constructor(client: NellyClient) {
        super(client, {
            name: "unlock",
            description: "Unlocks a text channel for server members.",
            category: Category.Utilities,
            default_member_permissions: PermissionFlagsBits.ManageChannels,
            dm_permissions: true,
            development: false,
            cooldown: 2,
            options: [
                {
                    name: "channel",
                    description: "Select the channel you want to unlock.",
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
            channel.permissionOverwrites.edit(everyone.id, { CreatePublicThreads: true, AddReactions: true, SendMessages: true });

            const UnlockEmbed = new EmbedBuilder()
            .setColor(Color.Success)
            .setDescription(`${Symbols.Success} The channel ${channel} has been successfully unlocked.`)
    
            interaction.reply({ embeds: [UnlockEmbed] });
            
        } else {
            throw new Error("CommandError: An error occurred in Unlock command.")
        }
    }
}