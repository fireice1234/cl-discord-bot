import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../types';

export const command : SlashCommand = {
    command: new SlashCommandBuilder()
        .setName('rankup')
        .setDescription('rankup')
        .addStringOption(option => option
            .setName('email')
            .setDescription('user email')
            .setRequired(true)),
    execute: async (interaction) => {
        const email = interaction.options.getString('email')!;
        const user = await fetch(`${process.env.SERVER_URL}/api/rankup?email=${email}`, { method: "PATCH" })
            .then(async (res) => await res.json())
        if ('error' in user) {
            interaction.reply({
                content: "[Error] " + user.error
            });
        } else {
            interaction.reply({
                content: "[Message] " + user.message
            })
        }
        
    }
};
