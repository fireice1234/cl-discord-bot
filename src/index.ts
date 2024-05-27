import { Client, Collection } from 'discord.js';
import { config } from 'dotenv';
import { checkEnv, executeFile } from './functions';
import { SlashCommand, Event } from './types';
import { run } from './server';
config();

export const client = new Client({
    intents: []
});

client.commands = new Collection<string, SlashCommand>();


const login = async (token: string | undefined) => {
    if (typeof token != 'string') {
        throw Error('env not include TOKEN or TOKEN type is not string now type is : ' + typeof token);
    } 

    checkEnv([
        process.env.PERSON_ROLE_ID,
        process.env.MEMBER_ROLE_ID,
        process.env.OBSERVER_ROLE_ID,
        process.env.ADMIN_ROLE_ID,
        process.env.CLIENT_ID,
        process.env.SERVER_URL,
        process.env.API_URL,
        process.env.GUILD_ID,
        process.env.THREAD_ID,
        process.env.DATABASE_URL
    ]);

    await executeFile('/commands', (file) => {
        const command : SlashCommand = file.command;
        if ('command' in command && 'execute' in command) {
            client.commands.set(command.command.name, command);
        } else {
            throw Error('requred command and execute');
        }
    });

    await executeFile('/events', (file) => {
        const event : Event = file.event;
        if (typeof event?.once == 'boolean' && event?.once) {
            client.once(event.name, event.execute);
        } else {
            client.on(event.name, event.execute);
        }
    });

    client.login(token);
};

login(process.env.TOKEN).then(() => {
    run();
});

