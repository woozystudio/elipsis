import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionFlagsBits } from "discord.js";
import NellyClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";
import Symbols from "../enums/Symbols";

export default class AddRoleCommand extends Command {
    constructor(client: NellyClient) {
        super(client, {
            name: "addrole",
            description: "Add a role to a user on the server.",
            category: Category.Utilities,
            userPermissions: PermissionFlagsBits.ManageRoles,
            dmPermissions: true,
            development: true,
            cooldown: 2,
            options: [
                {
                    name: "target",
                    description: "Select the user you want to add the role to.",
                    required: true,
                    type: ApplicationCommandOptionType.User
                },
                {
                    name: "role",
                    description: "Select the role you want to add to the user.",
                    required: true,
                    type: ApplicationCommandOptionType.Role
                }
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getUser('target');
        const role = interaction.options.getRole('role');
        
        if(target && role && interaction.guild) {
            const member = await interaction.guild?.members.fetch(target.id);
            
            if(member) {
                const AddRoleEmbed = new EmbedBuilder()
                .setColor(Color.Success)
                .setDescription(`${Symbols.Success} The role ${role} has been correctly granted to ${target}.`);

                const AlreadyHasEmbed = new EmbedBuilder()
                .setColor(Color.Danger)
                .setDescription(`${Symbols.Error} The user ${target} already has the role ${role}.`);

                const FailedEmbed = new EmbedBuilder()
                .setColor(Color.Danger)
                .setDescription(`${Symbols.Error} The role ${role} has a higher position than my role.`);

                if (member.roles.cache.has(role.id)) {
                    await interaction.reply({ embeds: [AlreadyHasEmbed] });
                    return;
                } try {
                    await member.roles.add(role.id);
                    await interaction.reply({ embeds: [AddRoleEmbed] });
                } catch (error) {
                    console.error(error);
                    await interaction.reply({ embeds: [FailedEmbed] });
                }
            }
        } else {
            throw new Error("CommandError: An error occurred in AddRole command.");
        }
    }
}