import express from 'express';
import { prisma } from '../lib/prisma';
import { client } from '../index';
import { TextChannel } from 'discord.js';
import path from 'path';

const app = express();
const port = 3030;
const dirPath = __dirname.replace('/dist', '');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('discord api endpoint!');
});

app.use('/api/connect', async (req, res) => {
    const { token, userId } = req.query;
    const provid = await prisma.provid.findFirst({
        where: {
            token: String(token),
        }
    });
    if (provid) {
        const { email, discordId } = provid;
        await prisma.connect.create({
            data: {
                userId: String(userId),
                email: email,
                discordId: discordId
            }
        });

        await prisma.provid.delete({
            where: {
                token: String(token)
            }
        });
        const message = await fetch(`${process.env.SERVER_URL}/api/rankup?email=${email}`, { method: 'PATCH' })
            .then(async (res) => await res.json());

        if ('error' in message) {
            res.sendFile(path.join(dirPath, '/html/server/fail.html'));
        } else {
            res.sendFile(path.join(dirPath, '/html/server/success.html'));
        }
    } else {
        res.sendFile(path.join(dirPath, '/html/server/fail.html'));
    }
});

app.patch('/api/rankup', async (req, res) => {
    const { email } = req.query;
    const user = await fetch(`${process.env.API_URL}/api/users?email=${email}`)
        .then(async r => await r.json());
    if (!('error' in user)) {
        const connect = await prisma.connect.findFirst({
            where: {
                email: user.email
            }
        });
        if (connect) {
            const guild = await client.guilds.fetch(process.env.GUILD_ID!);
            const member = await guild.members.fetch(connect.discordId);
            const channel = await guild.channels.fetch(process.env.THREAD_ID!) as TextChannel;
            let roleName : undefined | string = 'cl';
            if (user.rank === 'member') {
                
                const memberRole = await guild.roles.fetch(process.env.MEMBER_ID!);
                await member.roles.add(memberRole!);
                console.log('member');
                roleName = memberRole?.name;
            } else if (user.rank === 'observer') {
                const observerRole = await guild.roles.fetch(process.env.OBSERVER_ID!);
                await member.roles.add(observerRole!);

                roleName = observerRole?.name;
            }
            if (roleName === 'cl') {
                res.json({
                    error: '유저의 랭크가 조금 이상한데요..?'
                });
            } else {
                await channel.send(`${member.user.username}님이 ${roleName}역할을 부여받았습니다.`);
                res.json({
                    message: `유저가 디스코드에서 ${roleName} 역할을 부여받았습니다!`
                });

            }
        } else {
            res.json({
                error: '유저가 디스코드와 연결을 하지 않았습니다!'
            });
        }
    } else {
        res.json({
            error: '유저가 회원가입을 하지 않았습니다. 혹시 철자가 틀리셨는지?'
        });
    }
});

export async function run() {
    app.listen(port, () => {
        console.log(`start express server port = ${port}`);
        console.log(`url http://localhost:${port}`);
    });
}