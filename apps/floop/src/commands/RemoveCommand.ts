import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from "discord.js";
import FloopClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Ticket from "../database/models/Ticket";
import Symbols from "../enums/Symbols";

export default class SetupTicketsCommand extends Command {
    constructor(client: FloopClient) {
        super(client, {
            name: "remove",
            description: "Remove a user to the ticket.",
            category: Category.Utilities,
            userPermissions: PermissionFlagsBits.ManageChannels,
            dmPermissions: true,
            development: true,
            cooldown: 2,
            options: [
                {
                    name: "target",
                    description: "Select the user you want to remove.",
                    type: ApplicationCommandOptionType.User,
                    required: true
                }
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getUser('target');
        const channel = await interaction.channel as TextChannel;

        if(target && interaction.guild && channel) {

            try {
                const data = await Ticket.findOne({ GuildID: interaction.guild.id, ChannelID: channel.id });
                if (!data) return interaction.reply({ content: `${Symbols.Error} An error occurred while loading the data, please try again later...`, ephemeral: true });
        
                const index = data.MembersID.indexOf(target.id);
                if (index !== -1) {
                    data.MembersID.splice(index, 1)
                } else {
                    console.log('The user could not be removed from the array.');
                }

                channel.permissionOverwrites.edit(target.id, {
                    SendMessages: false,
                    ViewChannel: false,
                    ReadMessageHistory: false
                });

                interaction.reply({ content: `${Symbols.Success} The user ${target} was successfully removed from the ticket.` });

                data.save();               
            } catch (err) {
                console.error(err);
                throw new Error("CommandError: An error occurred in SetupTickets command.")
            }
        } else {
            interaction.reply({ content: `${Symbols.Error} An error has occurred, try again later...`, ephemeral: true });
        }

    }
}