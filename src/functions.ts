import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { Rank } from './types';
import { GuildMember } from 'discord.js';

export const rootDir = process.cwd();


export function RankToNumber(rank: Rank): number {
    if (rank === 'person') {
        return 0;
    } else if (rank === 'member') {
        return 1;
    } else if (rank === 'observer') {
        return 2;
    } else {
        return 3;
    }
}

export async function UpdateRole(member: GuildMember, rank: Rank) {
    const rankHighest = RankToNumber(rank);
    const personRole = await member.guild.roles.fetch(process.env.PERSON_ROLE_ID!);
    const memberRole = await member.guild.roles.fetch(process.env.MEMBER_ROLE_ID!);
    const observerRole = await member.guild.roles.fetch(process.env.OBSERVER_ROLE_ID!);
    const adminRole = await member.guild.roles.fetch(process.env.ADMIN_ROLE_ID!);
    const hasPersonRole = member.roles.cache.some(role => role.id == process.env.PERSON_ROLE_ID);
    const hasMemverRole = member.roles.cache.some(role => role.id == process.env.MEMBER_ROLE_ID);
    const hasObserverRole = member.roles.cache.some(role => role.id == process.env.OBSERVER_ROLE_ID);
    const hasAdminRole = member.roles.cache.some(role => role.id == process.env.ADMIN_ROLE_ID);

    if (rankHighest >= 0) {
        if (hasPersonRole) {
            await member.roles.add(personRole!);
        }
    } else {
        if (!hasPersonRole) {
            await member.roles.remove(personRole!);
        }
    }
    if (rankHighest >= 1) {
        if (hasMemverRole) {
            await member.roles.add(memberRole!);
        }
    } else {
        if (!hasMemverRole) {
            await member.roles.remove(memberRole!);
        }
    }
    if (rankHighest >= 2) {
        if (hasObserverRole) {
            await member.roles.add(observerRole!);
        }
    } else {
        if (!hasObserverRole) {
            await member.roles.remove(observerRole!);
        }
    }
    if (rankHighest >= 3) {
        if (hasAdminRole) {
            await member.roles.add(adminRole!);
        }
    } else {
        if (!hasAdminRole) {
            await member.roles.remove(adminRole!);
        }
    }
}

export function checkEnv(envList: (string | undefined)[]) {
    envList.forEach(element => {
        if (element == undefined) {
            throw Error('undfined');
        }
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const executeFile = async (path : string, func : (file: any) => void) => {
    const files: string[] = readdirSync(__dirname+path);
    
    for (const file of files) {
        const filePath = join(__dirname+path, file);

        if (statSync(filePath).isDirectory()) {
            await executeFile(`${path}/${file}`, func);
        } else if (file.endsWith('.js') && !file.startsWith('__')) {
            const file = await require(filePath);
            func(file);
        }
    }
};