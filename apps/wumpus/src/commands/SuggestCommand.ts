import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";
import WumpusClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import SuggestionSetup from "../database/models/Suggestion";

export default class SuggestCommand extends Command {
    constructor(client: WumpusClient) {
        super(client, {
            name: "suggest",
            description: "Creates a suggestion for the server.",
            category: Category.Utilities,
            userPermissions: PermissionFlagsBits.UseApplicationCommands,
            dmPermissions: true,
            development: false,
            cooldown: 2,
            options: [
                {
                    name: "suggestion",
                    description: "Write your suggestion here.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    channelType: ChannelType.GuildText
                }
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const suggestion = interaction.options.getString('suggestion');

        try {
            if(suggestion && interaction.guild) {
                const data = await SuggestionSetup.findOne({ GuildID: interaction.guild.id });

                if(data && data.Channel) {
                    const SuggestionEmbed = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                    .addFields({
                        name: "Suggestion",
                        value: `${suggestion}`
                    })
                    .setColor("Yellow")
                    .setTimestamp()
    
                    const reaction = this.client.channels.cache.get(data.Channel) as TextChannel;
                    reaction.send({ embeds: [SuggestionEmbed] }).then(sendMessage => {
                        sendMessage.react('👍')
                        sendMessage.react('👎')
                    })
                    
                    interaction.reply({ content: "✅ `|` The suggestion system has been configured correctly!" });
                } else {
                    interaction.reply({ content: "❌ `|` You have not configured the suggestion system." });
                }
            }
        } catch (err) {
            console.error(err);
            interaction.reply({ content: "❌ `|` There was an error configuring the suggestion system." });
        }
    }
}