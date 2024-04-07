import { model, Schema } from "mongoose";

let applicationSchema = new Schema({
    GuildID: String,
    Channel: String,
    Message: String,
    Questions: Array
});

export default model("Application", applicationSchema);