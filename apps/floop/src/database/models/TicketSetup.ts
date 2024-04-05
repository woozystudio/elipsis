import { model, Schema } from "mongoose";

let ticketSetup = new Schema({
    GuildID: String,
    Channel: String,
    Category: String,
    Description: String,
    PingMods: String
});

export default model("TicketSetup", ticketSetup);