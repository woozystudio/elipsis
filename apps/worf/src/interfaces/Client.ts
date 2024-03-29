import { Collection } from "discord.js";
import IConfig from "./Config";
import Command from "../classes/Command";
import SubCommand from "../classes/SubCommand";

export default interface IClient {
    config: IConfig;
    commands: Collection<string, Command>;
    subCommands: Collection<string, SubCommand>;
    cooldowns: Collection<string, Collection<string, number>>;
    development: boolean;

    Init(): void;
    LoadHandlers(): void;
}