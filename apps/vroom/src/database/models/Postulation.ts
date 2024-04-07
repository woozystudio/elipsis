import { model, Schema } from "mongoose";

let postulationSchema = new Schema({
    GuildID: String,
    ChannelID: String,
    ApplicationID: String,
    Approved: String,
    Author: String,
    Closed: Boolean
});

export default model("Postulation", postulationSchema);