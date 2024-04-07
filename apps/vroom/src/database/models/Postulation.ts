import { model, Schema } from "mongoose";

let postulationSchema = new Schema({
    GuildID: String,
    ChannelID: String,
    ApplicationID: String,
    Aproved: String,
    Author: String,
    Closed: Boolean
});

export default model("Postulation", postulationSchema);