import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import VroomClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";
import Symbols from "../enums/Symbols";
import Postulation from "../database/models/Postulation";

export default class ApproveCommand extends Command {
    constructor(client: VroomClient) {
        super(client, {
            name: "approve",
            description: "Approve an application.",
            category: Category.Utilities,
            default_member_permissions: PermissionFlagsBits.ManageChannels,
            dm_permissions: true,
            development: true,
            cooldown: 2,
            options: [
                {
                    name: "author",
                    description: "Select the user you want to accept their application.",
                    required: true,
                    type: ApplicationCommandOptionType.User
                }
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const author = interaction.options.getUser('author');

        if (author && interaction.guild) {
            const data = await Postulation.findOne({ Author: author.id });

            if (data && interaction.memberPermissions && data.Author) {
                if (!data.ClaimedBy) return interaction.reply({ content: `${Symbols.Error} You must claim the application before it can be approved.`, ephemeral: true })
                if (data.Approved === "Approved") return interaction.reply({ content: `${Symbols.Error} This application is already approved.`, ephemeral: true });

                await data.updateOne({ Approved: "Approved" });
                
                const ApprovedEmbed = new EmbedBuilder()
                .setDescription(`${Symbols.Success} The application has been successfully approved!`)
                .setColor(Color.Success)

                const UserApproveEmbed = new EmbedBuilder()
                .setDescription(`
                    ¡Hello again! \`👋\`
                    We are sending you this message from the **${interaction.guild.name}** server anxious to tell you that your application has been accepted! Congratulations, we are waiting for you on the server. \`🎉\`
                `)
                .setColor(Color.Sponsors);

                const authordis = await interaction.guild.members.fetch(data.Author);
                authordis.send({ embeds: [UserApproveEmbed] }).catch((interaction) => interaction.channel?.send({ content: `${Symbols.Error} There was an error sending the message to the user.` }));

                interaction.reply({ embeds: [ApprovedEmbed] });
            }
        } else {
            throw new Error("CommandError: An error occurred in Approve command.")
        }
    }
}