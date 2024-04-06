import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionFlagsBits, TextChannel } from "discord.js";
import NellyClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";
import Symbols from "../enums/Symbols";

export default class TempRoleCommand extends Command {
    constructor(client: NellyClient) {
        super(client, {
            name: "temprole",
            description: "Temporarily add a role to a specific user.",
            category: Category.Moderation,
            userPermissions: PermissionFlagsBits.BanMembers,
            dmPermissions: true,
            development: true,
            cooldown: 2,
            options: [
                {
                    name: "target",
                    description: "Select the user you want to ban.",
                    required: true,
                    type: ApplicationCommandOptionType.User
                },
                {
                    name: "role",
                    description: "Select the role you want to add to the user.",
                    required: true,
                    type: ApplicationCommandOptionType.Role
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
                }
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getUser('target');
        const role = interaction.options.getRole('role');
        const duration: any = interaction.options.getString('duration');
        const durationMs = duration * 1000;
        const expiresAt = Math.floor((Date.now() + durationMs) / 1000);
        
        if(target && role && interaction.guild && interaction.member) {
            try {
                const member = await interaction.guild.members.fetch(target.id);
                const interactionMember = interaction.member as GuildMember;
                const bot = interaction.guild.members.me as GuildMember;

                if(member.roles.highest.position >= interactionMember.roles.highest.position) return await interaction.reply({ content: `${Symbols.Error} You can't take action on ${target} since they have a higher role.`, ephemeral: false });

                if(role?.position > bot.roles.highest.position) return await interaction.reply({ content: `${Symbols.Error} The role has a higher position than that of the bot.`, ephemeral: false });

                if(bot.roles.highest.position >= interactionMember.roles.highest.position) return await interaction.reply({ content: `${Symbols.Error} I can't take action on ${target} since they have a higher role.`, ephemeral: false });

                if(interaction.member.user.id === target.id) return await interaction.reply({ content: `${Symbols.Error} You cannot ban yourself from the server.`, ephemeral: false });

                if(member.roles.cache.has(role.id)) return interaction.reply({ content: `${Symbols.Error} The user ${target} already has the role ${role}.`, ephemeral: false });

                await interaction.guild.members.cache.get(target.id)?.roles.add(role.id);

                const TempRoleEmbed = new EmbedBuilder()
                    .setColor(Color.Success)
                    .setDescription(`${Symbols.Success} The role ${role} was added to the user ${target} and will be removed in <t:${expiresAt}:R>`)

                await interaction.reply({ embeds: [TempRoleEmbed] });

                setTimeout(async () => {
                    if(interaction.guild) return await interaction.guild.members.cache.get(target.id)?.roles.remove(role.id); 
                }, durationMs);
            } catch (err) {
                console.error(err);
            }
            
        } else {
            throw new Error("CommandError: An error occurred in TempRole command.")
        }
    }
}