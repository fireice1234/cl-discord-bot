import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../types';
import { prisma } from '../lib/prisma';

export const command : SlashCommand = {
    command: new SlashCommandBuilder()
        .setName('connect')
        .setDescription('connect discord to vercel')
        .addStringOption(option => option
            .setName('email')
            .setDescription('user email')
            .setRequired(true)),
    execute: async (interaction) => {
        const token = Math.random().toString().replace('0.', '');
        const id = interaction.user.id;
        const email = interaction.options.getString('email')!;
        interaction.deferReply({ ephemeral: true });
        const user = await prisma.connect.findFirst({
            where: {
                email
            }
        });
        if (user) {
            interaction.editReply({ content: '이미 연결되었습니다' });
        } else {
            await prisma.provid.create({
                data: {
                    token: token,
                    email: email,
                    discordId: id
                }
            });
            
            await fetch(`${process.env.API_URL}/api/discord/provid`, {
                method: 'POST',
                body: JSON.stringify({
                    token,
                    id,
                    email
                })
            });
            
            interaction.editReply({ content: '이메일이 전송되 었습니다' });
        }
        
    }
};