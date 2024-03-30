import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import WorfClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";

export default class UserInfoCommand extends Command {
    constructor(client: WorfClient) {
        super(client, {
            name: "userinfo",
            description: "Displays information about a user.",
            category: Category.Information,
            userPermissions: PermissionFlagsBits.UseApplicationCommands,
            dmPermissions: true,
            development: false,
            cooldown: 2,
            options: [
                {
                    name: "target",
                    description: "Select the user you want to view.",
                    required: true,
                    type: ApplicationCommandOptionType.User,
                }
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getUser('target');

        if (target) {
            const member = await interaction.guild?.members.fetch(target?.id);

            if (member?.joinedTimestamp) {
                const roles = member.roles.cache.map((role) => role);
                const permissions = member.permissions.toArray().map((perm) => `\`${perm}\``);

                const UserEmbed = new EmbedBuilder()
                .setColor(Color.Embed)
                .setDescription(`${target}`)
                .setThumbnail(target?.displayAvatarURL({ size: 2048 }))
                .setAuthor({ iconURL: target?.displayAvatarURL(), name: `${target?.username}` })
                .addFields(
                    { name: 'Date Created', value: `<t:${Math.floor(target?.createdTimestamp / 1000)}>` },
                    { name: 'Date Joined', value: `<t:${Math.floor(member?.joinedTimestamp / 1000)}>` },
                    { name: 'Roles', value: `${roles.join(' ')}` },
                    { name: 'Permissions', value: `${permissions.join(' ')}` },
                )
                
                interaction.reply({ embeds: [UserEmbed] });
            }
        } else {
            throw new Error("CommandError: An error occurred in UserInfo command.")
        }
    }
}