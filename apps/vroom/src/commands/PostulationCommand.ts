import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import VroomClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";
import Postulation from "../database/models/Postulation";

export default class PostulationsCommand extends Command {
    constructor(client: VroomClient) {
        super(client, {
            name: "applications",
            description: "Check your status or your activity in the server applications.",
            category: Category.Utilities,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            dm_permissions: true,
            development: false,
            cooldown: 2,
            options: [],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        try {
            const data = await Postulation.findOne({ Author: interaction.user.id });

            const NotFound = new EmbedBuilder()
            .setTitle("Server Postulations")
            .setColor(Color.Embed)
            .setDescription("Check your status or your activity in the server applications.")
            .addFields(
                { name: 'Your application was not found', value: `If you think this is an error, please contact the server.` },
            )
            .setTimestamp()

            const WaitingForAnswer = new EmbedBuilder()
            .setTitle("Server Postulations")
            .setColor(Color.Embed)
            .setDescription("Check your status or your activity in the server applications.")
            .addFields(
                { name: 'Application Status', value: `Waiting for answer...` },
                { name: 'Created at', value: `<t:${data?.Date}:F>` },
            )
            .setTimestamp()

            const Approved = new EmbedBuilder()
            .setTitle("Server Postulations")
            .setColor(Color.Success)
            .setDescription("Check your status or your activity in the server applications.")
            .addFields(
                { name: 'Application Status', value: `<:checkmark:1219293026489339914> Approved` },
                { name: 'Created at', value: `<t:${data?.Date}:F>` },
            )
            .setTimestamp()

            const Disapproved = new EmbedBuilder()
            .setTitle("Server Postulations")
            .setColor(Color.Danger)
            .setDescription("Check your status or your activity in the server applications.")
            .addFields(
                { name: 'Application Status', value: `<:crossmark:1219293029681201242> Disapproved` },
                { name: 'Created at', value: `<t:${data?.Date}:F>` },
            )
            .setTimestamp()

            if(data?.Approved === undefined) {

                await interaction.reply({ embeds: [NotFound] });

            } else if(data.Approved === "Waiting for Answer") {

                await interaction.reply({ embeds: [WaitingForAnswer] });

            } else if(data.Approved === "Approved") {

                await interaction.reply({ embeds: [Approved] });

            } else if(data.Approved === "Disapproved") {

                await interaction.reply({ embeds: [Disapproved] });
            }

        } catch (err) {
            console.error(err);
            throw new Error("CommandError: An error occurred in Postulation command.")
        }
    }
}