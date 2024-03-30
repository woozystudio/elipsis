import { ApplicationCommandOptionType, CacheType, ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import WorfClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";

export default class GuildInfoCommand extends Command {
    constructor(client: WorfClient) {
        super(client, {
            name: "guildinfo",
            description: "Displays information about the server.",
            category: Category.Information,
            userPermissions: PermissionFlagsBits.UseApplicationCommands,
            dmPermissions: true,
            development: false,
            cooldown: 2,
            options: [],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        
        if(interaction.guild) {
            const owner = await interaction.guild.fetchOwner();

            const GuildEmbed = {
                "color": Color.Embed,
                "title": "Server Information",
                "thumbnail": {
                    url: `${interaction.guild.iconURL({ size: 2048 })}`
                },
                "fields": [
                    {
                        "name": "Name",
                        "value": `\`\`\`\n${interaction.guild.name}\n\`\`\``,
                        "inline": true
                    },
                    {
                        "name": "Owner",
                        "value": `\`\`\`\n${owner.user.username}\n\`\`\``,
                        "inline": true
                    },
                    {
                        "name": "",
                        "value": "",
                        "inline": false
                    },
                    {
                        "name": "Members",
                        "value": `\`\`\`\n${interaction.guild.memberCount}/500000\n\`\`\``,
                        "inline": true
                    },
                    {
                        "name": "Boosts",
                        "value": `\`\`\`\n${interaction.guild.premiumSubscriptionCount || "0"}\n\`\`\``,
                        "inline": true
                    },
                    {
                        "name": "",
                        "value": "",
                        "inline": false
                    },
                    {
                        "name": "Roles",
                        "value": `\`\`\`\n${interaction.guild.roles.cache.size}/250\n\`\`\``,
                        "inline": true
                    },
                    {
                        "name": "Channels",
                        "value": `\`\`\`\n${interaction.guild.channels.cache.filter(channel => channel.type !== ChannelType.GuildCategory).size}/500\n\`\`\``,
                        "inline": true
                    },
                    {
                        "name": "Emojis",
                        "value": `\`\`\`\n${interaction.guild.emojis.cache.size}/250\n\`\`\``,
                        "inline": true
                    },
                    {
                        "name": "",
                        "value": "",
                        "inline": false
                    },
                    {
                        "name": "Date created",
                        "value": `<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:F>`,
                        "inline": true
                    }
                ]
            }

            interaction.reply({ embeds: [GuildEmbed] });
        }
    }
}