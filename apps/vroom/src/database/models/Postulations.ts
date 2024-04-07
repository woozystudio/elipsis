import { model, Schema } from "mongoose";

let applicationSchema = new Schema({
    Name: String,
    Aproved: Boolean,
    Author: String,
});

export default model("Application", applicationSchema);