import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionFlagsBits } from "discord.js";
import NellyClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";
import Symbols from "../enums/Symbols";

export default class BotInfoCommand extends Command {
    constructor(client: NellyClient) {
        super(client, {
            name: "unban",
            description: "Unban a user from the server.",
            category: Category.Moderation,
            userPermissions: PermissionFlagsBits.BanMembers,
            dmPermissions: true,
            development: false,
            cooldown: 2,
            options: [
                {
                    name: "id",
                    description: "Enter the id of the user you want to unban.",
                    required: true,
                    type: ApplicationCommandOptionType.String
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
        const id = interaction.options.getString('id');
        const reason = interaction.options.getString('reason');
        
        if(id && interaction.guild) {
            if (reason != null) {
                try {
                    await interaction.guild.members.unban(id, reason);

                    const BanEmbed = new EmbedBuilder()
                    .setColor(Color.Success)
                    .setDescription(`${Symbols.Success} The user <@${id}> has been successfully unbanned from the server. \n### Reason \n\`\`\`\n${reason}\n\`\`\``)

                    interaction.reply({ embeds: [BanEmbed] });
                } catch (err) {
                    console.error(err);
                    interaction.reply({ content: `${Symbols.Error} Missing Permissions. Check if the bot has permissions to unban users.` })
                }
            } else if (reason === null) {
                try {
                    await interaction.guild.members.unban(id);

                    const BanEmbed = new EmbedBuilder()
                    .setColor(Color.Success)
                    .setDescription(`${Symbols.Success} The user <@${id}> has been successfully unbanned from the server.`)

                    interaction.reply({ embeds: [BanEmbed] });

                } catch (err) {
                    console.error(err);
                    interaction.reply({ content: `${Symbols.Error} Missing Permissions. Check if the bot has permissions to unban users.`, ephemeral: true })
                }
            }
        } else {
            throw new Error("CommandError: An error occurred in Ban command.")
        }
    }
}