import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, CategoryChannel, ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";
import VroomClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";
import Application from "../database/models/Application";
import Symbols from "../enums/Symbols";

export default class SetupApplicationsCommand extends Command {
    constructor(client: VroomClient) {
        super(client, {
            name: "setup-postulations",
            description: "Configure the postulation system on the server.",
            category: Category.Utilities,
            default_member_permissions: PermissionFlagsBits.ManageGuild,
            dm_permissions: true,
            development: false,
            cooldown: 2,
            options: [
                {
                    name: "channel",
                    description: "Select the channel where the postulation message will be sent.",
                    required: true,
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildText]
                },
                {
                    name: "category",
                    description: "Select the category where the prostulations will be created.",
                    required: true,
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildCategory]
                },
                {
                    name: "description",
                    description: "Write a description for the postulation message.",
                    required: false,
                    type: ApplicationCommandOptionType.String
                },
                {
                    name: "question-one",
                    description: "Write down question one.",
                    required: false,
                    type: ApplicationCommandOptionType.String
                },
                {
                    name: "question-two",
                    description: "Write down question two.",
                    required: false,
                    type: ApplicationCommandOptionType.String
                },
                {
                    name: "question-three",
                    description: "Write down question three.",
                    required: false,
                    type: ApplicationCommandOptionType.String
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const channel = interaction.options.getChannel('channel') as TextChannel;
        const category = interaction.options.getChannel('category') as CategoryChannel;
        const description = interaction.options.getString('description') || "`🌟` Welcome to the server postulations! This is your chance to apply, don't be afraid, if you make a mistake don't worry because we all make mistakes. You are welcome and free to make this postulation, don't miss it! It may be the last time, so take advantage of it.";
        const question1 = interaction.options.getString('question-one') || "What is the reason for this application?";
        const question2 = interaction.options.getString('question-two') || "Do you think you have everything you need to apply?";
        const question3 = interaction.options.getString('question-three') || "Why should we accept you over anyone else?";

        if(interaction.guild) {
            try {
                const data = await Application.findOneAndUpdate({ GuildID: interaction.guild.id }, {
                    Channel: channel.id,
                    Category: category.id,
                    Description: description,
                    Questions: [question1, question2, question3]
                },
                {
                    new: true,
                    upsert: true
                });

                const AppEmbed = new EmbedBuilder()
                    .setDescription(description)
                    .setColor(Color.Embed)
        
                const Buttons = new ActionRowBuilder().setComponents(
                    new ButtonBuilder()
                    .setCustomId("openapp")
                    .setLabel("Open Application")
                    .setEmoji("📩")
                    .setStyle(ButtonStyle.Secondary),
                )
    
                const guildChannel = interaction.guild.channels.cache.get(channel.id) as TextChannel;
    
                await guildChannel.send({ embeds: [AppEmbed], components: [new ActionRowBuilder<ButtonBuilder>(Buttons)] });

                interaction.reply({ content: `${Symbols.Success} The application system has been configured correctly.`, ephemeral: false });
            } catch (err) {
                console.error(err);
            }
        } else {
            throw new Error("CommandError: An error occurred in SetupApplications command.")
        }
    }
}