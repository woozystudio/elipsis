import { ApplicationCommandOptionType, CacheType, ChannelType, ChatInputCommandInteraction, EmbedBuilder, GuildChannel, PermissionFlagsBits, TextChannel } from "discord.js";
import WorfClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";

export default class ChannelInfoCommand extends Command {
    constructor(client: WorfClient) {
        super(client, {
            name: "channelinfo",
            description: "Displays information about a channel.",
            category: Category.Information,
            userPermissions: PermissionFlagsBits.UseApplicationCommands,
            dmPermissions: true,
            development: false,
            cooldown: 2,
            options: [
                {
                    name: "channel",
                    description: "Select the channel you want to view.",
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                }
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const channel = await interaction.options.getChannel('channel');

        if(channel) {
            const channels = await interaction.guild?.channels.fetch(channel.id);
            let type;
            switch (channel.type) {
                case 0:
                    type = "Text Channel";
                    break;
                case 2:
                    type = "Voice Channel"
                    break;
                case 5:
                    type = "Announcement Channel"
                    break;
                case 13:
                    type = "Stage Channel"
                    break;
                case 15:
                    type = "Forum Channel"
                    break;
                case 16:
                    type = "Media Channel"
                    break;
                case 12:
                    type = "Private Thread Channel"
                    break;
                case 11:
                    type = "Public Thread Channel"
                    break;
            }

            if(channels?.createdTimestamp) {
                const ChannelEmbed = new EmbedBuilder()
                .setColor(Color.Embed)
                .setTitle("Channel Information")
                .addFields(
                    { name: 'Name', value: `\`\`\`${channel.name}\`\`\``, inline: true },
                    { name: 'ID', value: `\`\`\`${channel.id}\`\`\``, inline: true },
                    { name: 'Topic', value: `\`\`\`${(channel as TextChannel).topic || "No topic is set or unavailable" }\`\`\``, inline: false },
                    { name: 'Type', value: `\`\`\`${type}\`\`\``, inline: true },
                    { name: 'Parent', value: `\`\`\`${channels?.parent?.name}\`\`\``, inline: true },
                    { name: 'Date created', value: `<t:${Math.floor(channels?.createdTimestamp / 1000)}:F>`, inline: false },
                )
                interaction.reply({ embeds: [ChannelEmbed] });
            }
        } else {
            throw new Error("CommandError: An error occurred in ChannelInfo command.")
        }
    }
}