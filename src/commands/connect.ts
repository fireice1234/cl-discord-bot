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
        await interaction.deferReply({ ephemeral: true });
        const user = await prisma.connect.findFirst({
            where: {
                email: email
            }
        });
        if (user) {
            interaction.editReply({ content: '이미 연결되었습니다' });
        } else {

            if (await prisma.provid.findMany({
                where: {
                    email: email
                }
            })) { // 리스트, 값이 true 인가 값없음도 true인가
                await prisma.provid.deleteMany({
                    where: {
                        email: email
                    }
                });
            }

            const prob = await prisma.provid.create({
                data: {
                    token: token,
                    email: email,
                    discordId: id
                }
            });
            
            const res = await fetch(`${process.env.API_URL}/api/discord/provid`, {
                method: 'POST',
                body: JSON.stringify({
                    token: prob.token,
                    email
                })
            }).then(async (res) => await res.json());

            if ('error' in res) {
                await prisma.provid.delete({
                    where: {
                        token: token
                    }
                });
                interaction.editReply({ content: res.error });
            } else {
                interaction.editReply({ content: '이메일이 전송되 었습니다' });
            }   
        }
    }
};