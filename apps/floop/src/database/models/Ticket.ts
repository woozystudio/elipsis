import { model, Schema } from "mongoose";

let ticketSchema = new Schema({
    GuildID: String,
    MembersID: [String],
    TicketID: String,
    ChannelID: String,
    Closed: Boolean,
    Locked: Boolean,
});

export default model("Ticket", ticketSchema);