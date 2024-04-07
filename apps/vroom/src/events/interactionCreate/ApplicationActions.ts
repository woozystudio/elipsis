import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, Events, PermissionFlagsBits } from "discord.js";
import VroomClient from "../../classes/Client";
import Event from "../../classes/Event";
import Application from "../../database/models/Application";
import Postulation from "../../database/models/Postulation";
import Color from "../../enums/Color";
import Symbols from "../../enums/Symbols";

export default class ApplicationActions extends Event {
    constructor(client: VroomClient) {
        super(client, {
            name: Events.InteractionCreate,
            description: "ApplicationActions Event",
            once: false
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) { 
        if(interaction.isButton()) {
            const buttons = interaction as ButtonInteraction;

            if(buttons.guild && buttons.member && buttons.channel && buttons.memberPermissions ) {
                if(!["close", "options"].includes(buttons.customId)) return;

                const data = await Postulation.findOne({ GuildID: buttons.guild.id });
                if(!buttons.guild.members.me?.permissions.has(PermissionFlagsBits.ManageChannels)) return buttons.reply({ content: `${Symbols.Error} The bot needs permission from \`ManageChannels\` to do this action.` });
                if(data) {
                    switch (buttons.customId) {
                        case "close":
                            if (!buttons.memberPermissions.has(PermissionFlagsBits.ManageChannels)) return buttons.reply({ content: `${Symbols.Error} You do not have permission to close this application.`, ephemeral: true });
                            if (data.Closed === true) return buttons.reply({ content: `${Symbols.Error} This application is already getting deleted...`, ephemeral: true });
                            
                            await Postulation.updateOne({ ChannelID: buttons.channel.id }, { Closed: true });
                            const DeletedTicket = new EmbedBuilder()
                            .setDescription(`The application will be deleted in 5s...`)
                            .setColor(Color.Danger)

                            buttons.channel.send({ embeds: [DeletedTicket] });
                            setTimeout(async function () {
                                if(buttons.channel && buttons.guild) {
                                    buttons.channel.delete();
                                    await Postulation.deleteOne({ GuildID: buttons.guild.id }, { ChannelID: buttons.channel.id });
                                }
                            }, 5000)
                            
                            buttons.reply({ content: `${Symbols.Success} The application is being prepared for closing.`, ephemeral: true });

                            break;
                        
                        case "options":
                            if (!buttons.memberPermissions.has(PermissionFlagsBits.ManageChannels)) return buttons.reply({ content: `${Symbols.Error} You do not have permission to close this application.`, ephemeral: true });

                            const OptionsEmbed = new EmbedBuilder()
                            .setAuthor({ iconURL: buttons.user.displayAvatarURL(), name: buttons.user.username })
                            .setTitle("Application Options")
                            .setColor(Color.Embed)
                            .setDescription(`Menu of options for applications. To approve or disapprove applications you have to click on the respective buttons.`)

                            const Buttons = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                .setCustomId('approve')
                                .setLabel('Approve')
                                .setEmoji('<:checkmark:1219293026489339914>')
                                .setStyle(ButtonStyle.Success),

                                new ButtonBuilder()
                                .setCustomId('disapprove')
                                .setLabel('Disapprove')
                                .setEmoji('<:crossmark:1219293029681201242>')
                                .setStyle(ButtonStyle.Danger),
                            )

                            buttons.reply({ embeds: [OptionsEmbed], components: [new ActionRowBuilder<ButtonBuilder>(Buttons)] });
                        default:
                            break;
                    }
                }
            }
        }
    }
}