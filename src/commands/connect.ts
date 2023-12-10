import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../types';
import { prisma } from '../lib/prisma';

export const command : SlashCommand = {
    command: new SlashCommandBuilder()
        .setName('connect')
        .setDescription('connect discord to vercel')
        .addStringOption(option => option
            .setName('email')
            .setDescription('user email')),
    execute: async (interaction) => {
        const token = Math.random().toString().replace('0.', '');
        const id = interaction.user.id;
        const email = interaction.options.getString('email')!;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body : any = {
            token,
            id,
            email
        };

        prisma.provid.create({
            data: {
                token: token,
                email: email,
                discordId: id
            }
        }).then(() => {
            fetch(`${process.env.API_URL}/api/discord/provid`, {
                method: 'POST',
                body: JSON.stringify(body)
            }).then(async res => {
                console.log(await res.json());
            });
        });
        interaction.reply({ content: '이메일이 전송되 었습니다', ephemeral: true });
    }
};