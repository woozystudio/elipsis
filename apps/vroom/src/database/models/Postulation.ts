import { model, Schema } from "mongoose";

let postulationSchema = new Schema({
    GuildID: String,
    ChannelID: String,
    ApplicationID: String,
    Approved: String,
    Author: String,
    Closed: Boolean,
    Date: String,
    Claimed: Boolean,
    ClaimedBy: String
});

export default model("Postulation", postulationSchema);