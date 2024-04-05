import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, ChatInputCommandInteraction, EmbedBuilder, Events, PermissionFlagsBits } from "discord.js";
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

    async Execute(interaction: ChatInputCommandInteraction, buttons: ButtonInteraction) {
        if(interaction.isButton()) {
            const buttons = interaction as ButtonInteraction;

            if(buttons.guild && buttons.member) {
                const ticketId = Math.floor(Math.random() * 9000) + 10000;
        
                const data = await TicketSetup.findOne({ GuildID: buttons.guild.id });
                const docs = await Ticket.findOne({ GuildID: buttons.guild.id });
                
                if(!data) return;
                if(!buttons.customId.includes("openticket")) return;
                if(!buttons.guild.members.me?.permissions.has(PermissionFlagsBits.ManageChannels)) return buttons.reply({ content: `${Symbols.Error} The bot needs permission from \`ManageChannels\` to do this action.` });
                
                const everyoneRoleId = buttons.guild.roles.everyone;
    
                try {
                    await buttons.guild.channels.create({
                        name: `${buttons.member?.user.username}-ticket${ticketId}`,
                        type: ChannelType.GuildText,
                        parent: data.Category,
                        permissionOverwrites: [
                            {
                                id: everyoneRoleId,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: buttons.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                        ]
                    }).then(async (channel) => {
                        if(buttons.guild && buttons.member) {
                            const newTicketSchema = await Ticket.create({
                                GuildID: buttons.guild.id,
                                MembersID: buttons.member.user.id,
                                TicketID: ticketId,
                                ChannelID: channel.id,
                                Closed: false,
                                Locked: false,
                                Claimed: false
                            });
    
                            const TicketEmbed = new EmbedBuilder()
                            .setTitle("Hi, Welcome to your Ticket!")
                            .setDescription("A staff member will be with you in a few moments, please be patient.\nWhile a staff member is assisting you, please comment your problem. Again, please be patient!")
                            .setColor(Color.Success)
    
                            const button = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                .setCustomId('close')
                                .setLabel('Close')
                                .setEmoji('🔒')
                                .setStyle(ButtonStyle.Secondary),

                                new ButtonBuilder()
                                .setCustomId('claim')
                                .setLabel('Claim')
                                .setEmoji('📌')
                                .setStyle(ButtonStyle.Secondary)
                            )

                            const UserEmbed = new EmbedBuilder()
                            .setDescription(`
                                ¡Hello! \`👋\`
                                We sent you this message from the **${buttons.guild.name}** server to remind you that you have opened a ticket! We are waiting for you in the channel: <#${channel.id}>. Thank you.
                            `)
                            .setColor(Color.Embed);
    
                            channel.send({ content: `<@&${data.PingMods}> ${buttons.user}`, embeds: [TicketEmbed], components: [new ActionRowBuilder<ButtonBuilder>(button)] });
                            buttons.user.send({ embeds: [UserEmbed] }).catch((buttons) => buttons.channel?.send({ content: `${Symbols.Error} There was an error sending the reminder to the user.` }))
    
                            buttons.reply({ content: `${Symbols.Success} Your ticket has been successfully created in <#${channel.id}>.`, ephemeral: true })
                        }
                    });
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }
}