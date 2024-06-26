import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, ChatInputCommandInteraction, EmbedBuilder, Events, PermissionFlagsBits } from "discord.js";
import VroomClient from "../../classes/Client";
import Event from "../../classes/Event";
import Application from "../../database/models/Application";
import Postulation from "../../database/models/Postulation";
import Color from "../../enums/Color";
import Symbols from "../../enums/Symbols";

export default class ApplicationResponse extends Event {
    constructor(client: VroomClient) {
        super(client, {
            name: Events.InteractionCreate,
            description: "ApplicationResponse Event",
            once: false
        });
    }

    async Execute(interaction: ChatInputCommandInteraction, buttons: ButtonInteraction) {
        if(interaction.isButton()) {
            const buttons = interaction as ButtonInteraction;

            if(buttons.guild && buttons.member) {
                const appId = Math.floor(Math.random() * 9000) + 10000;
        
                const data = await Application.findOne({ GuildID: buttons.guild.id });
                const docs = await Postulation.findOne({ Author: buttons.member?.user.id  });
                
                if(!data) return;
                if(buttons.customId != "openapp") return;
                if(!buttons.guild.members.me?.permissions.has(PermissionFlagsBits.ManageChannels)) return buttons.reply({ content: `${Symbols.Error} The bot needs permission from \`ManageChannels\` to do this action.` });
                if(docs && buttons.member) {
                    if(buttons.member.user.id === docs.Author) return await buttons.reply({ content: `${Symbols.Error} You already have an open application.`, ephemeral: true })
                }

                const everyoneRoleId = buttons.guild.roles.everyone;
                try {
                    await buttons.guild.channels.create({
                        name: `${buttons.member?.user.username}-app${appId}`,
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
                            const createdAt = Math.floor(channel.createdTimestamp / 1000);

                            const newTicketSchema = await Postulation.create({
                                GuildID: buttons.guild.id,
                                ChannelID: channel.id,
                                Author: buttons.member.user.id,
                                ApplicationID: appId,
                                Approved: "Waiting for Answer",
                                Date: createdAt
                            });
    
                            const TicketEmbed = new EmbedBuilder()
                            .setTitle("Hi, Welcome to your postulation!")
                            .setDescription(`A member of the staff will be with you in a few moments, please be patient. While you wait, we ask you to answer the following questions:\n \n1. ${data.Questions[0]}\n2. ${data.Questions[1]}\n3. ${data.Questions[2]}`)
                            .setColor(Color.Embed)
    
                            const button = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                .setCustomId('close')
                                .setLabel('Close')
                                .setEmoji('🔒')
                                .setStyle(ButtonStyle.Secondary),

                                new ButtonBuilder()
                                .setCustomId('options')
                                .setLabel('Options')
                                .setEmoji('⚙')
                                .setStyle(ButtonStyle.Secondary),

                                new ButtonBuilder()
                                .setCustomId('claim')
                                .setLabel('Claim')
                                .setEmoji('📌')
                                .setStyle(ButtonStyle.Secondary),
                            )

                            const UserEmbed = new EmbedBuilder()
                            .setDescription(`
                                ¡Hello! \`👋\`
                                We sent you this message from the **${buttons.guild.name}** server to remind you that you have opened a postulation! We are waiting for you in the channel: <#${channel.id}>. Thank you.
                            `)
                            .setColor(Color.Embed);
    
                            channel.send({ content: `${buttons.user}`, embeds: [TicketEmbed], components: [new ActionRowBuilder<ButtonBuilder>(button)] });
                            buttons.user.send({ embeds: [UserEmbed] }).catch((buttons) => buttons.channel?.send({ content: `${Symbols.Error} There was an error sending the reminder to the user.` }))
    
                            buttons.reply({ content: `${Symbols.Success} Your application has been successfully created in <#${channel.id}>.`, ephemeral: true })
                        }
                    });
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }
}