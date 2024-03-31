import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import WorfClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";

export default class AvatarCommand extends Command {
    constructor(client: WorfClient) {
        super(client, {
            name: "avatar",
            description: "Displays the avatar of a user.",
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
            const AvataEmbed = new EmbedBuilder()
            .setColor(Color.Embed)
            .setTitle(`@${target.username}'s avatar`)
            .setImage(target?.displayAvatarURL({ size: 2048 }))
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                
            interaction.reply({ embeds: [AvataEmbed] });
        } else {
            throw new Error("CommandError: An error occurred in Avatar command.")
        }
    }
}