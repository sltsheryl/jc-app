import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) { 
    try {
        const httpMethod = req.method;
        if (httpMethod == 'GET') {
            const games = await prisma.spotTheDifferenceGame.findMany();
            res.status(200).json(games);
        } else if (httpMethod == 'POST') {
            const { gameId, leftImageId, rightImageId, differences } = req.body
            const created = await prisma.spotTheDifferenceGame.create({
                data: {
                    gameId: gameId,
                    leftImageId: leftImageId,
                    rightImageId: rightImageId,
                    differences: differences
                },
            })
            res.status(200).json(created)
        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${httpMethod} not allowed`)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
}