import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import VroomClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";
import Symbols from "../enums/Symbols";
import Postulation from "../database/models/Postulation";

export default class DisapproveCommand extends Command {
    constructor(client: VroomClient) {
        super(client, {
            name: "disapprove",
            description: "Disapprove an application.",
            category: Category.Utilities,
            default_member_permissions: PermissionFlagsBits.ManageChannels,
            dm_permissions: true,
            development: false,
            cooldown: 2,
            options: [
                {
                    name: "author",
                    description: "Select the user you want to deprecate their application.",
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
                if (!data.ClaimedBy) return interaction.reply({ content: `${Symbols.Error} You must claim the application before it can be disapproved.`, ephemeral: true })
                if (data.Approved === "Disapproved") return interaction.reply({ content: `${Symbols.Error} This application is already disapprove.`, ephemeral: true });

                await data.updateOne({ Approved: "Disapproved" });
                
                const DisapproveEmbed = new EmbedBuilder()
                    .setDescription(`${Symbols.Success} The application has been successfully disapproved.`)
                    .setColor(Color.Success)

                const UserDisapproveEmbed = new EmbedBuilder()
                    .setDescription(`
                    ¡Hello again! \`👋\`
                    We send you this message from the **${interaction.guild.name}** server. We are sorry but your application was not approved, we hope you understand. Any doubt contact the server staff, sorry again.
                `)
                    .setColor(Color.Note);

                const authordis = await interaction.guild.members.fetch(data.Author);
                authordis.send({ embeds: [UserDisapproveEmbed] }).catch((interaction) => interaction.channel?.send({ content: `${Symbols.Error} There was an error sending the message to the user.` }));

                interaction.reply({ embeds: [DisapproveEmbed] });
            }
        } else {
            throw new Error("CommandError: An error occurred in Disapprove command.")
        }
    }
}