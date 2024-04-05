import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";
import NellyClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";
import Symbols from "../enums/Symbols";

export default class UntimeoutCommand extends Command {
    constructor(client: NellyClient) {
        super(client, {
            name: "untimeout",
            description: "Untimeout a user from the server.",
            category: Category.Moderation,
            userPermissions: PermissionFlagsBits.ManageChannels,
            dmPermissions: true,
            development: false,
            cooldown: 2,
            options: [
                {
                    name: "target",
                    description: "Select the user you want to untimeout.",
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
        const reason: any = interaction.options.getString('reason' || "No reason provided.");
        
        if(target && interaction.channel && interaction.guild && interaction.member) {
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
            .setDescription(`${Symbols.Error} You cannot execute the untimeout action on yourself.`);

            const CannotWithAdminPerms = new EmbedBuilder()
            .setColor(Color.Danger)
            .setDescription(`${Symbols.Error} I cannot untimeout a user with administrator permissions.`);

            const NoPermissions = new EmbedBuilder()
            .setColor(Color.Danger)
            .setDescription(`${Symbols.Error} You do not have permissions to execute this command.`);

            if(!interactionMember.permissions.has(PermissionFlagsBits.ModerateMembers)) return await interaction.reply({ embeds: [NoPermissions] });
            if(!member) return await interaction.reply({ embeds: [UserMentionenNoValid] });
            if(!member.kickable) return await interaction.reply({ embeds: [CannotModerateUser] });
            if(interaction.user.id === member.id) return await interaction.reply({ embeds: [CannotModerateYourself] });
            if(member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({ embeds: [CannotWithAdminPerms] });
            
            member.timeout(null, reason);

            const TimeoutEmbed = new EmbedBuilder()
            .setColor(Color.Success)
            .setDescription(`${Symbols.Success} The user ${target} has been untimeout successfully. \n### Reason \n\`\`\`\n${reason || "No reason provided."}\n\`\`\``)

            await interaction.reply({ embeds: [TimeoutEmbed], ephemeral: false })
                        
        } else {
            throw new Error("CommandError: An error occurred in Lock command.")
        }
    }
}