import express from 'express';
import { prisma } from '../lib/prisma';

const app = express();
const port = 3030;

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
        res.send({
            message: 'success connect discord!',
            discordId: discordId,
            email: email
        });
    } else {
        res.send({
            message: 'faild connect discord...',
            token: token,
            userId: userId
        });
    }
});

export async function run() {
    app.listen(port, () => {
        console.log('start express server...');
    });
}