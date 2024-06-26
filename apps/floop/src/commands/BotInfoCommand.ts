import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import FloopClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";

export default class BotInfoCommand extends Command {
    constructor(client: FloopClient) {
        super(client, {
            name: "botinfo",
            description: "Displays information about the bot.",
            category: Category.Information,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            dm_permissions: true,
            development: false,
            cooldown: 2,
            options: [],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        if(this.client.user) {
            const member = await interaction.guild?.members.fetch(this.client.user.id);
            if(member) {
                const permissions = member.permissions.toArray().map((perm) => `\`${perm}\``);

                const BotEmbed = new EmbedBuilder()
                .setColor(Color.Embed)
                .setTitle(`${this.client.user?.username}`)
                .setDescription(`Bot Information.`)
                .setThumbnail(`${this.client.user?.displayAvatarURL({ size: 2048 })}`)
                .setAuthor({ iconURL: this.client.user?.displayAvatarURL(), name: `${this.client.user?.username}` })
                .addFields(
                    { name: 'Nickname', value: `${this.client.user?.username}`, inline: true },
                    { name: 'User', value: `${this.client.user}`, inline: true },
                    { name: 'Credits', value: `Developer: woozystudio`, inline: false },
                    { name: 'Date created', value: `<t:${Math.floor(this.client.user?.createdTimestamp / 1000)}:F>`, inline: false },
                    { name: 'Permissions', value: `${permissions.join(' ')}`, inline: false },
                )
    
                interaction.reply({ embeds: [BotEmbed] });
            }
        } else {
            throw new Error("CommandError: An error occurred in BotInfo command.")
        }
    }
}