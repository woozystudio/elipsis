import { Collection, Events, REST, Routes, PresenceUpdateStatus } from "discord.js";
import WumpusClient from "../../classes/Client";
import Event from "../../classes/Event";
import Command from "../../classes/Command";
import 'colors';

export default class Ready extends Event {
    constructor(client: WumpusClient) {
        super(client, {
            name: Events.ClientReady,
            description: "Ready Event",
            once: true
        })
    }

    async Execute() {
        console.log(`Logged as ${this.client.user?.tag}`.green);

        this.client.user?.setPresence({ status: PresenceUpdateStatus.Idle })

        const clientId = this.client.development ? this.client.config.developmentBotId : this.client.config.botId;
        const rest = new REST().setToken(this.client.config.token);

        if(!this.client.development) {
            const globalCommands: any = await rest.put(Routes.applicationCommands(clientId), {
                body: this.GetJson(this.client.commands.filter(command => !command.development))
            });

            console.log(`Successfully loaded ${globalCommands.length} global application commands.`.yellow)
        }

        const devCommands: any = await rest.put(Routes.applicationGuildCommands(clientId, this.client.config.developmentGuildId), {
            body: this.GetJson(this.client.commands.filter(command => command.development))
        });

        console.log(`Successfully loaded ${devCommands.length} development application commands.`.red)
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