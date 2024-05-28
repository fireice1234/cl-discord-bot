import express from 'express';
import { prisma } from '../lib/prisma';
import { client } from '../index';
import path from 'path';
import { UpdateRole, rootDir } from '../functions';
import { FetchError, FetchUser } from '../types';

const app = express();
const port = 3030;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('discord api endpoint!');
});

app.use('/api/connect', async (req, res) => {
    const { token, userId } = req.query;
    console.log(token, userId);
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

        console.log(message);
        if ('error' in message) {
            client.users.send(discordId, message.error);
            res.sendFile(path.join(rootDir, 'html/server/loading.html'));
        } else {
            client.users.send(discordId, message.message);
            res.sendFile(path.join(rootDir, 'html/server/success.html'));
        }
    } else {
        res.sendFile(path.join(rootDir, 'html/server/fail.html'));
    }
});

app.patch('/api/rankup', async (req, res) => {
    const { email } = req.query;
    const user = await fetch(`${process.env.API_URL}/api/users?email=${email}`)
        .then(async r => await r.json()) as FetchUser | FetchError;
    if (!('error' in user)) {
        const connect = await prisma.connect.findFirst({
            where: {
                email: user.email!
            }
        });
        if (connect) {
            const guild = await client.guilds.fetch(process.env.GUILD_ID!);
            try {
                const member = await guild.members.fetch(connect.discordId);
                await UpdateRole(member, user.rank);
            } catch (error) {
                res.json({
                    error: 'member undefined'
                });
                return;
            }
            res.json({
                message: 'role update',
            });
            return;
        } else {
            res.json({
                error: 'user not connected'
            });
            return;
        }
    } else {
        res.json({
            error: 'undefined Jeonil User'
        });
        return;
    }
});

export async function run() {
    app.listen(port, () => {
        console.log(`start express server port = ${port}`);
        console.log(`url http://localhost:${port}`);
    });
}