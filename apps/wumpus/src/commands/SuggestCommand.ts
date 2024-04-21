import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, TextChannel, ThreadChannel } from "discord.js";
import WumpusClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import SuggestionSetup from "../database/models/Suggestion";
import Symbols from "../enums/Symbols";
import Color from "../enums/Color";

export default class SuggestCommand extends Command {
    constructor(client: WumpusClient) {
        super(client, {
            name: "suggest",
            description: "Creates a suggestion for the server.",
            category: Category.Utilities,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            dm_permissions: true,
            development: false,
            cooldown: 2,
            options: [
                {
                    name: "suggestion",
                    description: "Write your suggestion here.",
                    type: ApplicationCommandOptionType.String,
                    required: true
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
    
                    const message = this.client.channels.cache.get(data.Channel) as TextChannel;

                    if(data.Ping != undefined) {
                        message.send({ content: `<@&${data.Ping}>`, embeds: [SuggestionEmbed] }).then(async sendMessage => {
                            sendMessage.react('👍');
                            sendMessage.react('👎');

                            await sendMessage.startThread({
                                name: "Discussion"
                            }).then((thread) => {
                                const ThreadEmbed = new EmbedBuilder()
                                .setDescription("`📌` Within this thread you can start a conversation about this suggestion!")
                                .setColor(Color.Success)

                                thread.send({ embeds: [ThreadEmbed] });
                                thread.setRateLimitPerUser(5);
                            });
                        }).catch(err => {
                            console.error(err);
                        });
                    } else if(data.Ping === undefined) {
                        message.send({ embeds: [SuggestionEmbed] }).then(async sendMessage => {
                            sendMessage.react('👍');
                            sendMessage.react('👎');

                            await sendMessage.startThread({
                                name: "Discussion"
                            }).then((thread) => {
                                const ThreadEmbed = new EmbedBuilder()
                                .setDescription("`📌` Within this thread you can start a conversation about this suggestion!")
                                .setColor(Color.Success)

                                thread.send({ embeds: [ThreadEmbed] });
                                thread.setRateLimitPerUser(5);
                            });
                        }).catch(err => {
                            console.error(err);
                        });;
                    }
                    
                    interaction.reply({ content: `${Symbols.Success} The suggestion has been sent successfully!`, ephemeral: true });
                } else {
                    interaction.reply({ content: `${Symbols.Error} You have not configured the suggestion system.`, ephemeral: true });
                }
            }
        } catch (err) {
            console.error(err);
            interaction.reply({ content: `${Symbols.Error} There was an error sending the suggestion.`, ephemeral: true });
        }
    }
}