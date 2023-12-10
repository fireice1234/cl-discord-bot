import { SlashCommandBuilder, TextChannel } from 'discord.js';
import { SlashCommand } from '../../types';
import { prisma } from '../../lib/prisma';

export const command : SlashCommand = {
    command: new SlashCommandBuilder()
        .setName('thread-delete')
        .setDescription('create private channel')
        .addChannelOption(option => option
            .setName('thread')
            .setDescription('thread')),
    execute: async (interaction) => {
        const thread = interaction.options.getChannel('thread');
        await interaction.deferReply();
        const channel = await interaction.client.channels.fetch(process.env.THREAD_ID!) as TextChannel;
        const threadData = await prisma.thread.findFirst({
            where: {
                name: thread!.name!
            }
        });
        if (interaction.user.id === threadData?.adminId) {
            const threadChannel = channel.threads.cache.find(x=> x.id === thread?.id);
            await threadChannel?.delete();
            await prisma.thread.delete({
                where: {
                    id: threadData.id
                }
            });
            interaction.editReply(`${thread?.name} 이가 성공적으로 삭제되었습니다.`);
        } else {
            interaction.editReply(`${thread?.name} 이가 쓰레드가 아니거나 당신이 만든것이 아닙니다`);
        }
    }
};