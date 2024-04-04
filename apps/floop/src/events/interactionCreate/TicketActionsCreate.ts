import { ButtonInteraction, ChatInputCommandInteraction, EmbedBuilder, Events, PermissionFlagsBits } from "discord.js";
import FloopClient from "../../classes/Client";
import Event from "../../classes/Event";
import TicketSetup from "../../database/models/TicketSetup";
import Ticket from "../../database/models/Ticket";
import Color from "../../enums/Color";
import Symbols from "../../enums/Symbols";

export default class InteractionCreate extends Event {
    constructor(client: FloopClient) {
        super(client, {
            name: Events.InteractionCreate,
            description: "TicketResponse Event",
            once: false
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) { 
        if(interaction.isButton()) {
            const buttons = interaction as ButtonInteraction;

            if(buttons.guild && buttons.member && buttons.channel) {
                if(!buttons.customId.includes("close")) return;
                const docs = await TicketSetup.findOne({ GuildId: buttons.guild.id });
                const data = await Ticket.findOne({ GuildID: buttons.guild.id });
                if(!buttons.guild.members.me?.permissions.has(PermissionFlagsBits.ManageChannels)) return buttons.reply({ content: `${Symbols.Error} The bot needs permission from \`ManageChannels\` to do this action.` });
                if(data) {
                    switch (buttons.customId) {
                        case "close":
                            if (data.Closed === true) return buttons.reply({ content: `${Symbols.Success} This ticket is already getting deleted...`, ephemeral: true });
        
                            await Ticket.updateOne({ ChannelID: buttons.channel.id }, { Closed: true });
                            const DeletedTicket = new EmbedBuilder()
                            .setDescription(`The ticket will be deleted in 5s...`)
                            .setColor(Color.Danger)
        
                            buttons.channel.send({ embeds: [DeletedTicket] });
                            setTimeout(function () {
                                if(buttons.channel) {
                                    buttons.channel.delete();
                                }
                            }, 5000)
        
                            buttons.reply({ content: `${Symbols.Success} Your ticket is being prepared for closing.` });
                            break;
                        
                        default:
                            break;
                    }
                }
            }
        }

    }
}