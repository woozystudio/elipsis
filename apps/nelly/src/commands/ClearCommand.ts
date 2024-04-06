import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";
import NellyClient from "../classes/Client";
import Command from "../classes/Command";
import Category from "../enums/Category";
import Color from "../enums/Color";
import Symbols from "../enums/Symbols";

export default class LockCommand extends Command {
    constructor(client: NellyClient) {
        super(client, {
            name: "clear",
            description: "Delete messages from a channel.",
            category: Category.Utilities,
            default_member_permissions: PermissionFlagsBits.ManageMessages,
            dm_permissions: true,
            development: false,
            cooldown: 2,
            options: [
                {
                    name: "amount",
                    description: "Write the amount of messages to clear.",
                    required: true,
                    type: ApplicationCommandOptionType.Integer
                }
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const amount = interaction.options.getInteger('amount');
        
        if(amount && interaction.channel) {
            const messages = await interaction.channel.messages.fetch({ limit: amount +1 });
            const channel = interaction.channel as TextChannel;

            await channel.bulkDelete(amount, true).then(messages => {
                const DeletedMessages = new EmbedBuilder()
                .setColor(Color.Success)
                .setDescription(`${Symbols.Success} Successfully deleted **${messages.size}** messages from the channel.`)
    
                interaction.reply({ embeds: [DeletedMessages], ephemeral: false });
            });
    
            setTimeout(async () => {
                if(interaction.channel) {
                    const channel = interaction.channel as TextChannel;
                    await channel.bulkDelete(1, true)
                }
            }, 2000);
        } else {
            throw new Error("CommandError: An error occurred in Clear command.")
        }
    }
}