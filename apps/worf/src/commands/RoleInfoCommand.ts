import { ApplicationCommandOptionType, CacheType, ChannelType, ChatInputCommandInteraction, EmbedBuilder, GuildChannel, PermissionFlagsBits, TextChannel } from "discord.js";
import WorfClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";

export default class RoleInfoCommand extends Command {
    constructor(client: WorfClient) {
        super(client, {
            name: "roleinfo",
            description: "Displays information about a role.",
            category: Category.Information,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            dm_permissions: true,
            development: false,
            cooldown: 2,
            options: [
                {
                    name: "role",
                    description: "Select the role you want to view.",
                    type: ApplicationCommandOptionType.Role,
                    required: true
                }
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const role = await interaction.options.getRole('role');

        if(role) {
            const roles = await interaction.guild?.roles.fetch(role.id);
            const permissions = roles?.permissions.toArray().map((perm) => `\`${perm}\``);
            let mentionable;

            switch (roles?.mentionable) {
                case true:
                    mentionable = "Yes"
                    break;
                case false:
                    mentionable = "No"
                    break;
            }

            if(roles?.createdTimestamp) {
                const RoleEmbed = new EmbedBuilder()
                .setColor(Color.Embed)
                .setTitle("Role Information")
                .setDescription(`${role}`)
                .addFields(
                    { name: 'ID', value: `\`\`\`${role.id}\`\`\``, inline: false },
                    { name: 'Color', value: `\`\`\`${roles.hexColor}\`\`\``, inline: true },
                    { name: 'Position', value: `\`\`\`${roles.position}\`\`\``, inline: true },
                    { name: 'Mentionable', value: `\`\`\`${mentionable}\`\`\``, inline: true },
                    { name: 'Date created', value: `<t:${Math.floor(roles?.createdTimestamp / 1000)}>`, inline: false },
                    { name: 'Permissions', value: `${permissions?.join(' ')}`, inline: false },
                )
                interaction.reply({ embeds: [RoleEmbed] });
            }
        } else {
            throw new Error("CommandError: An error occurred in RoleInfo command.")
        }
    }
}