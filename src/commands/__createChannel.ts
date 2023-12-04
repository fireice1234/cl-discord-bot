import { ChannelType, GuildMemberRoleManager, PermissionsBitField, SlashCommandBuilder, TextChannel } from 'discord.js';
import { SlashCommand } from '../types';

export const command : SlashCommand = {
    command: new SlashCommandBuilder()
        .setName('create')
        .setDescription('create private channel')
        .addStringOption(option => option
            .setName('channel')
            .setDescription('channel name')),
    execute: async (interaction) => {
        const name = interaction.options.getString('channel');
        const channel = await interaction.client.channels.fetch(process.env.THREAD_ID!) as TextChannel;
        const thread = await channel.threads.create({
            name: name!,
            type: ChannelType.PrivateThread
        });
        thread.members.add(interaction.user.id);
        const role = await interaction.guild?.roles.create({
            name: `${name}-관리자`,
            permissions: [
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.KickMembers
            ]
        });
        const roles = interaction.member?.roles as GuildMemberRoleManager;
        roles.add(role!).catch(console.error);
        interaction.reply(`${thread.name} 이 생성 되었습니다`);
    }
};