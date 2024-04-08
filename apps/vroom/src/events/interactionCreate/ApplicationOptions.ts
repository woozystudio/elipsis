import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, Events, GuildMember, PermissionFlagsBits } from "discord.js";
import VroomClient from "../../classes/Client";
import Event from "../../classes/Event";
import Application from "../../database/models/Application";
import Postulation from "../../database/models/Postulation";
import Color from "../../enums/Color";
import Symbols from "../../enums/Symbols";

export default class ApplicationOptions extends Event {
    constructor(client: VroomClient) {
        super(client, {
            name: Events.InteractionCreate,
            description: "ApplicationOptions Event",
            once: false
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) { 
        if(interaction.isButton()) {
            const buttons = interaction as ButtonInteraction;

            if(buttons.guild && buttons.member && buttons.channel && buttons.memberPermissions ) {
                if(!["approve", "disapprove"].includes(buttons.customId)) return;

                const data = await Postulation.findOne({ GuildID: buttons.guild.id });
                if(!buttons.guild.members.me?.permissions.has(PermissionFlagsBits.ManageChannels)) return buttons.reply({ content: `${Symbols.Error} The bot needs permission from \`ManageChannels\` to do this action.`, ephemeral: true });
                if(data && data.Author) {
                    switch (buttons.customId) {
                        case "approve":
                            if (!buttons.memberPermissions.has(PermissionFlagsBits.ManageChannels)) return buttons.reply({ content: `${Symbols.Error} You do not have permission to approve this application.`, ephemeral: true });
                            if (data.Approved === "Approved") return buttons.reply({ content: `${Symbols.Error} This application is already approved.`, ephemeral: true });
                            
                            await Postulation.updateOne({ Approved: "Approved" });
                            const ApprovedEmbed = new EmbedBuilder()
                            .setDescription(`${Symbols.Success} The application has been successfully approved!`)
                            .setColor(Color.Success)

                            const UserApproveEmbed = new EmbedBuilder()
                            .setDescription(`
                                ¡Hello again! \`👋\`
                                We are sending you this message from the **${buttons.guild.name}** server anxious to tell you that your application has been accepted! Congratulations, we are waiting for you on the server. \`🎉\`
                            `)
                            .setColor(Color.Sponsors);
    
                            const authorap = await buttons.guild.members.fetch(data.Author);
                            authorap.send({ embeds: [UserApproveEmbed] }).catch((buttons) => buttons.channel?.send({ content: `${Symbols.Error} There was an error sending the message to the user.` }));
                            
                            buttons.reply({ embeds: [ApprovedEmbed] });

                            break;
                        
                        case "disapprove":
                            if (!buttons.memberPermissions.has(PermissionFlagsBits.ManageChannels)) return buttons.reply({ content: `${Symbols.Error} You do not have permission to disapprove this application.`, ephemeral: true });
                            if (data.Approved === "Disapproved") return buttons.reply({ content: `${Symbols.Error} This application is already disapprove.`, ephemeral: true });
                            
                            await Postulation.updateOne({ Approved: "Disapproved" });
                            const DisapproveEmbed = new EmbedBuilder()
                            .setDescription(`${Symbols.Success} The application has been successfully disapproved.`)
                            .setColor(Color.Success)

                            const UserDisapproveEmbed = new EmbedBuilder()
                            .setDescription(`
                                ¡Hello again! \`👋\`
                                We send you this message from the **${buttons.guild.name}** server. We are sorry but your application was not approved, we hope you understand. Any doubt contact the server staff, sorry again.
                            `)
                            .setColor(Color.Note);

                            const authordis = await buttons.guild.members.fetch(data.Author);
                            authordis.send({ embeds: [UserDisapproveEmbed] }).catch((buttons) => buttons.channel?.send({ content: `${Symbols.Error} There was an error sending the message to the user.` }));
                            
                            buttons.reply({ embeds: [DisapproveEmbed] });

                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }
}