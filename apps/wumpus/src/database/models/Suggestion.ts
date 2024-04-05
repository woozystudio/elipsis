import { model, Schema } from "mongoose";

let suggestionSetup = new Schema({
    GuildID: String,
    Channel: String,
    Ping: String
});

export default model("SuggestionSetup", suggestionSetup);