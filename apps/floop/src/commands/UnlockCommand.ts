import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from "discord.js";
import FloopClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Ticket from "../database/models/Ticket";
import Symbols from "../enums/Symbols";

export default class LockCommand extends Command {
    constructor(client: FloopClient) {
        super(client, {
            name: "unlock",
            description: "Unlocks a ticket from the user who created it.",
            category: Category.Utilities,
            default_member_permissions: PermissionFlagsBits.ManageChannels,
            dm_permissions: true,
            development: false,
            cooldown: 2,
            options: [],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        if(interaction.channel && interaction.memberPermissions) {
            if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: `You are not allowed to unlock a ticket.`, ephemeral: true });
            const data = await Ticket.findOne({ ChannelID: interaction.channel.id });
            if(!data) return;

            if (data.Locked === false) return interaction.reply({ content: `${Symbols.Error} The ticket has already been unlocked.`, ephemeral: true });
            await Ticket.updateOne({ ChannelID: interaction.channel.id }, { Locked: false });
            
            data.MembersID.forEach(async (user) => {
                if(interaction.channel) {
                    const channel = interaction.channel as TextChannel;
                    const member: any = await interaction.guild?.members.fetch(user);
                    await channel.permissionOverwrites.edit(member, { SendMessages: true })
                }
            });

            return interaction.reply({ content: `${Symbols.Success} The ticket has been successfully unlocked!` });
        }
    }
}