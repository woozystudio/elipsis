import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";
import NellyClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";
import Symbols from "../enums/Symbols";

export default class TimeoutCommand extends Command {
    constructor(client: NellyClient) {
        super(client, {
            name: "timeout",
            description: "Timeout a user from the server.",
            category: Category.Moderation,
            userPermissions: PermissionFlagsBits.ModerateMembers,
            dmPermissions: true,
            development: false,
            cooldown: 2,
            options: [
                {
                    name: "target",
                    description: "Select the user you want to time out.",
                    required: true,
                    type: ApplicationCommandOptionType.User
                },
                {
                    name: "duration",
                    description: "Select the duration of the timeout.",
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
        const reason: any = interaction.options.getString('reason' || "No reason provided.");
        
        if(target && duration && interaction.channel && interaction.guild && interaction.member) {
            const member = await interaction.guild.members.fetch(target.id);
            const interactionMember = await interaction.guild.members.fetch(interaction.user.id);
            const channel = await interaction.channel as TextChannel;
            const permissions = await channel.permissionsFor(member);

            const UserMentionenNoValid = new EmbedBuilder()
            .setColor(Color.Danger)
            .setDescription(`${Symbols.Error} The user mentioned is no longer within the server.`);

            const CannotModerateUser = new EmbedBuilder()
            .setColor(Color.Danger)
            .setDescription(`${Symbols.Error} I cannot timemout this user because he has a higher role than me.`);

            const CannotModerateYourself = new EmbedBuilder()
            .setColor(Color.Danger)
            .setDescription(`${Symbols.Error} You cannot execute the timeout action on yourself.`);

            const CannotWithAdminPerms = new EmbedBuilder()
            .setColor(Color.Danger)
            .setDescription(`${Symbols.Error} I cannot timeout a user with administrator permissions.`);

            const NoPermissions = new EmbedBuilder()
            .setColor(Color.Danger)
            .setDescription(`${Symbols.Error} You do not have permissions to execute this command.`);

            if(!interactionMember.permissions.has(PermissionFlagsBits.ModerateMembers)) return await interaction.reply({ embeds: [NoPermissions] });
            if(!member) return await interaction.reply({ embeds: [UserMentionenNoValid] });
            if(!member.kickable) return await interaction.reply({ embeds: [CannotModerateUser] });
            if(interaction.user.id === member.id) return await interaction.reply({ embeds: [CannotModerateYourself] });
            if(member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({ embeds: [CannotWithAdminPerms] });
            
            const durationMs = duration * 1000;
            const timeoutExpiresAt = Math.floor((Date.now() + durationMs) / 1000);

            member.timeout(durationMs, reason);

            const UserDirectMessagesEmbed = new EmbedBuilder()
            .setColor(Color.Embed)
            .setAuthor({ name: `${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`
                You have been timeout from **${interaction.guild.name}**

                **Reason:**
                > ${reason}

                **Time:**
                > <t:${timeoutExpiresAt}:R>
        
                You were timeout by ${interaction.user.tag}.
            `)

            const TimeoutEmbed = new EmbedBuilder()
            .setColor(Color.Success)
            .setDescription(`${Symbols.Success} The user ${target} has been timeout successfully.\nThe timeout will be cancelled in <t:${timeoutExpiresAt}:R>\n### Reason \n\`\`\`\n${reason || "No reason provided."}\n\`\`\``)

            await member.send({ embeds: [UserDirectMessagesEmbed] }).catch(err => { return; });
            await interaction.reply({ embeds: [TimeoutEmbed], ephemeral: false })
                        
        } else {
            throw new Error("CommandError: An error occurred in Timeout command.")
        }
    }
}