
import { prisma } from '../../lib/prisma';
import { SlashCommand } from '../../types';
import { ChannelType, SlashCommandBuilder, TextChannel } from 'discord.js';


export const command : SlashCommand = {
    command: new SlashCommandBuilder()
        .setName('thread-create')
        .setDescription('create private channel')
        .addStringOption(option => option
            .setName('channel')
            .setDescription('channel name')),
    execute: async (interaction) => {
        const name = interaction.options.getString('channel');
        await interaction.deferReply();
        const channel = await interaction.client.channels.fetch(process.env.THREAD_ID!) as TextChannel;
        const thread = await channel.threads.create({
            name: name!,
            type: ChannelType.PrivateThread
        });
        await thread.members.add(interaction.user.id);
        await prisma.thread.create({
            data: {
                adminId: interaction.user.id,
                name: name!,
                discordId: thread.id,
            }
        });
        await interaction.editReply(`${name} 이 생성 되었습니다`);
    }
};