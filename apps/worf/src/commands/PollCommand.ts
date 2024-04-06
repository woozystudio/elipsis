import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";
import WorfClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";
import Symbols from "../enums/Symbols";

export default class PollCommand extends Command {
    constructor(client: WorfClient) {
        super(client, {
            name: "poll",
            description: "Create a poll on the server.",
            category: Category.Utilities,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            dm_permissions: true,
            development: false,
            cooldown: 2,
            options: [
                {
                    name: "topic",
                    description: "Write a title for your poll.",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: "description",
                    description: "Write a description for your poll.",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: "vote-type",
                    description: "Select a voting type.",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        { name: "✅ & ❌", value: "check-cross" },
                        { name: "👍 & 👎", value: "good-bad" },
                        { name: "⬆ & ⬇", value: "up-down" }
                    ]
                },
                {
                    name: "channel",
                    description: "Select a channel to send your poll.",
                    required: false,
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildText]
                }
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const topic = interaction.options.getString('topic');
        const description = interaction.options.getString('description');
        const votetype = interaction.options.getString('vote-type');
        const channel = interaction.options.getChannel('channel');

        const PollEmbed = new EmbedBuilder()
        .setAuthor({ iconURL: `${interaction.user.displayAvatarURL()}`, name: interaction.user.username })
        .setTitle(topic)
        .setThumbnail(`${interaction.guild?.iconURL()}`)
        .setDescription(description)
        .setColor(Color.Embed)
        .setTimestamp()

        await interaction.reply({ content: `${Symbols.Success} The poll has been sent successfully!`, ephemeral: true });

        if(channel) {
            const Channel = await this.client.channels.cache.get(channel.id) as TextChannel;
            const Reaction = await Channel.send({ embeds: [PollEmbed] });

            if (votetype === "check-cross") {
                Reaction.react(`✅`);
                Reaction?.react(`❌`);
            } else if (votetype === "good-bad") {
                Reaction?.react(`👍`);
                Reaction?.react(`👎`);
            } else if (votetype === "up-down") {
                Reaction?.react(`⬆`);
                Reaction?.react(`⬇`);
            }

        } else {
            const Reaction = await interaction.channel?.send({ embeds: [PollEmbed] });
            if (votetype === "check-cross") {
                Reaction?.react(`✅`);
                Reaction?.react(`❌`);
            } else if (votetype === "good-bad") {
                Reaction?.react(`👍`);
                Reaction?.react(`👎`);
            } else if (votetype === "up-down") {
                Reaction?.react(`⬆`);
                Reaction?.react(`⬇`);
            }
        }
    }
}