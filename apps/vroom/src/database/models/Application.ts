import { model, Schema } from "mongoose";

let applicationSchema = new Schema({
    GuildID: String,
    Channel: String,
    Category: String,
    Description: String,
    Questions: Array
});

export default model("Application", applicationSchema);