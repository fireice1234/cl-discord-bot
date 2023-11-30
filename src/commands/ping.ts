import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../types';

export const command : SlashCommand = {
    command: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('show ping xzz'),
    execute: (interaction) => {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: 'ME' })
                    .setDescription(`🏓 Pong! \n 📡 Ping: ${interaction.client.ws.ping}`)
            ]
        });
    }
};
