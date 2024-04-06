import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";
import NellyClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";
import Symbols from "../enums/Symbols";

export default class TimeoutCommand extends Command {
    constructor(client: NellyClient) {
        super(client, {
            name: "tempban",
            description: "Bans a user temporarily from the server.",
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
                    name: "duration",
                    description: "Select the duration of the ban.",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        { name: '60 Seconds', value: '60' },
                        { name: '2 Minutes', value: '120' },
                        { name: '5 Minutes', value: '300' },
                        { name: '10 Minutes', value: '600' },
                        { name: '15 Minutes', value: '900' },
                        { name: '20 Minutes', value: '1200' },
                        { name: '30 Minutes', value: '1800' },
                        { name: '45 Minutes', value: '2700' },
                        { name: '1 Hour', value: '3600' },
                        { name: '2 Hours', value: '7200' },
                        { name: '3 Hours', value: '10800' },
                        { name: '5 Hours', value: '18000' },
                        { name: '10 Hours', value: '36000' },
                        { name: '1 Day', value: '86400' },
                        { name: '2 Day', value: '172800' },
                        { name: '3 Day', value: '259200' },
                        { name: '5 Days', value: '432000' },
                        { name: 'One Week', value: '604800' },
                    ]
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
        const duration: any = interaction.options.getString('duration');
        const reason: any = interaction.options.getString('reason');
        
        if(target && interaction.guild && interaction.member) {
            const banUser = this.client.users.cache.get(target.id);

            if(banUser) {

                if(interaction.member.user.id === target.id) return await interaction.reply({ content: `${Symbols.Error} You cannot ban yourself from the server.` });
                
                const durationMs = duration * 1000;
                const banExpiresAt = Math.floor((Date.now() + durationMs) / 1000);
                
                const UserDMEmbed = new EmbedBuilder()
                .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: `${interaction.user.username} (${interaction.user.id})` })
                .setColor(Color.Embed)
                .setDescription(`
                    You have been temporarily banned from **${interaction.guild.name}**
            
                    **Reason:**
                    > ${reason || "No reason provided."}
    
                    **Time:**
                    > <t:${banExpiresAt}:R>
                `)
                .setFooter({ text: `You were banned by @${interaction.user.username}.` })
                .setTimestamp()
                
                await banUser.send({ embeds: [UserDMEmbed] }).catch(err => { return console.error(err); });
                
                await interaction.guild.members.ban(target.id, { reason: `${reason || "No reason provided."}` }).catch(err => {
                    console.error(err);
                    return interaction.reply({ content: `${Symbols.Success} I do not have sufficient permissions to do this action.`, ephemeral: true })
                });

                if(reason != null) {
                    try {
                        const InteractionEmbed = new EmbedBuilder()
                        .setColor(Color.Success)
                        .setDescription(`${Symbols.Success} <@${banUser.id}> was temporarily banned. The ban will be cancelled in <t:${banExpiresAt}:R> \n### Reason \n\`\`\`\n${reason}\n\`\`\``)
    
                        await interaction.reply({ embeds: [InteractionEmbed], ephemeral: false });
                    } catch (err) {
                        console.error(err);
                    }
                } else if(reason === null) {
                    try {
                        const InteractionEmbed = new EmbedBuilder()
                        .setColor(Color.Success)
                        .setDescription(`${Symbols.Success} <@${banUser.id}> was temporarily banned. The ban will be cancelled in <t:${banExpiresAt}:R>`)
    
                        await interaction.reply({ embeds: [InteractionEmbed], ephemeral: false });
                    } catch (err) {
                        console.error(err);
                    }
                }

                setTimeout(async () => {
                    if(interaction.guild) return await interaction.guild.members.unban(target.id);
                }, durationMs);
            }         
        } else {
            throw new Error("CommandError: An error occurred in Timeout command.")
        }
    }
}