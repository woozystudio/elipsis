import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, CategoryChannel, ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";
import FloopClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import TicketSetup from "../database/models/TicketSetup";
import Color from "../enums/Color";
import Symbols from "../enums/Symbols";

export default class SetupTicketsCommand extends Command {
    constructor(client: FloopClient) {
        super(client, {
            name: "setup-tickets",
            description: "Configure the ticketing system on the server.",
            category: Category.Utilities,
            userPermissions: PermissionFlagsBits.ManageGuild,
            dmPermissions: true,
            development: false,
            cooldown: 2,
            options: [
                {
                    name: "channel",
                    description: "Select the channel where the ticket creation message will be sent.",
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                    channel_types: [ChannelType.GuildText]
                },
                {
                    name: "category",
                    description: "Select the category where the tickets will be created.",
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                    channel_types: [ChannelType.GuildCategory]
                },
                {
                    name: "description",
                    description: "Write the description of the ticket creation embed.",
                    type: ApplicationCommandOptionType.String,
                    required: false
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const channel = interaction.options.getChannel('channel') as TextChannel;
        const category = interaction.options.getChannel('category') as CategoryChannel;
        const description = interaction.options.getString('description') || "\`❓\` **What are tickets?**\nTickets are a very simple way for users to contact the server administration team. If you need to create a ticket for any question or doubt, or you need to report a user for bad behavior on the server, this is the place for you.\n \n\`🎫\` **Ticket Types**\nOn the server there are 2 types of tickets, general tickets and report tickets. General tickets are for questions or doubts about the server or something else related. And the report tickets are for reporting users for bad behavior, for example, or server bugs.\n \n\`🔨\` **Important**\nAny misuse of tickets is punishable, so be careful not to create too many tickets unnecessarily, or else you will be penalized.";
    
        if(channel && category && description && interaction.guild) {
            try {
                const data = await TicketSetup.findOneAndUpdate({ GuildID: interaction.guild.id }, {
                    Channel: channel.id,
                    Category: category.id,
                    Description: description
                },
                {
                    new: true,
                    upsert: true
                });
    
                const TicketsEmbed = new EmbedBuilder()
                    .setDescription(description)
                    .setColor(Color.Embed)
        
                const Buttons = new ActionRowBuilder().setComponents(
                    new ButtonBuilder()
                    .setCustomId("openticket")
                    .setLabel("Open Ticket")
                    .setEmoji("📩")
                    .setStyle(ButtonStyle.Secondary),
                )
    
                const guildChannel = interaction.guild.channels.cache.get(channel.id) as TextChannel;
    
                await guildChannel.send({ embeds: [TicketsEmbed], components: [new ActionRowBuilder<ButtonBuilder>(Buttons)] });
                interaction.reply({ content: `${Symbols.Success} The tickets panel has been successfully created.`, ephemeral: false });
                
            } catch (err) {
                console.error(err);
                throw new Error("CommandError: An error occurred in SetupTickets command.")
            }
        } else {
            interaction.reply({ content: `${Symbols.Error} An error has occurred, try again later...`, ephemeral: true });
        }

    }
}