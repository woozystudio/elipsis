import { Collection, Events, REST, Routes } from "discord.js";
import WorfClient from "../../classes/Client";
import Event from "../../classes/Event";
import Command from "../../classes/Command";
import 'colors';

export default class Ready extends Event {
    constructor(client: WorfClient) {
        super(client, {
            name: Events.ClientReady,
            description: "Ready Event",
            once: true
        })
    }

    async Execute() {
        console.log(`Logged as ${this.client.user?.tag}`.green);

        const rest = new REST().setToken(this.client.config.token);

        const commands: object[] = this.GetJson(this.client.commands);

        const setCommands: any = await rest.put(Routes.applicationGuildCommands(this.client.config.discordClientId, this.client.config.guildId), {
            body: commands
        });

        console.log(`Successfully set ${setCommands.length} commands!`.yellow);
    }

    private GetJson(commands: Collection<string, Command>): object[] {
        const data: object[] = [];

        commands.forEach(command => {
            data.push({
                name: command.name,
                description: command.description,
                options: command.options,
                userPermissions: command.userPermissions.toString(),
                dmPermissions: command.dmPermissions,
            })
        });

        return data;
    }
}