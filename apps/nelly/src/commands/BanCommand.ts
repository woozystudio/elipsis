import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionFlagsBits } from "discord.js";
import NellyClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";
import Symbols from "../enums/Symbols";

export default class BotInfoCommand extends Command {
    constructor(client: NellyClient) {
        super(client, {
            name: "ban",
            description: "Ban a user from the server.",
            category: Category.Moderation,
            userPermissions: PermissionFlagsBits.BanMembers,
            dmPermissions: true,
            development: false,
            cooldown: 2,
            options: [
                {
                    name: "target",
                    description: "Select the user you want to ban.",
                    required: true,
                    type: ApplicationCommandOptionType.User
                },
                {
                    name: "reason",
                    description: "Write down the reason for this sanction.",
                    required: false,
                    type: ApplicationCommandOptionType.String
                }
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');
        
        if(target && interaction.guild) {
            const member = await interaction.guild?.members.fetch(target.id);
            
            if(member) {
                if(reason != null) {
                    try {
                        await member.ban({ reason: reason });

                        const BanEmbed = new EmbedBuilder()
                        .setColor(Color.Success)
                        .setDescription(`${Symbols.Success} The user ${target} has been successfully banned from the server. \n### Reason \n\`\`\`\n${reason}\n\`\`\``)
        
                        interaction.reply({ embeds: [BanEmbed] });
                    } catch (err) {
                        console.error(err);
                        interaction.reply({ content: `${Symbols.Error} Missing Permissions. Check if the bot has a higher role than the user you want to ban.` })
                    }
                } else if(reason === null) {
                    try {
                        await member.ban();

                        const BanEmbed = new EmbedBuilder()
                        .setColor(Color.Success)
                        .setDescription(`${Symbols.Success} The user ${target} has been successfully banned from the server.`)
        
                        interaction.reply({ embeds: [BanEmbed] });
    
                    } catch (err) {
                        console.error(err);
                        interaction.reply({ content: `${Symbols.Error} Missing Permissions. Check if the bot has a higher role than the user you want to ban.`, ephemeral: true })
                    }
                }
            }
        } else {
            throw new Error("CommandError: An error occurred in Ban command.")
        }
    }
}