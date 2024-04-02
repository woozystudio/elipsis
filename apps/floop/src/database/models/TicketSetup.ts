import { model, Schema } from "mongoose";

let ticketSetup = new Schema({
    GuildID: String,
    Channel: String,
    Category: String,
    Everyone: String,
    Description: String,
    Ping: String
});

export default model("TicketSetup", ticketSetup);