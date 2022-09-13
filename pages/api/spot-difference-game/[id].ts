import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) { 
    try {
        const httpMethod = req.method;
        const id = req.query.id as string

        if (httpMethod == 'GET') {
            const game = await prisma.spotTheDifferenceGame.findFirst({
                       where: {id: id}
            });
            res.status(200).json(game);
        } else if (httpMethod == 'DELETE') {
            const deletedGame = await prisma.spotTheDifferenceGame.delete({
                where: {
                    id: id,
                },
            })
            res.status(200).json(deletedGame);
        } else if (httpMethod == 'PUT') {
            const { leftImageId, rightImageId, differences } = req.body
            const updatedGame = await prisma.spotTheDifferenceGame.update({
                where: {
                    id: id,
                },
                data: {
                    leftImageId: leftImageId,
                    rightImageId: rightImageId,
                    differences: differences,
                },
            })
            res.status(200).json({ leftImageId, rightImageId, differences })
        } else {
            res.setHeader('Allow', ['GET', 'DELETE', 'PUT']);
            res.status(405).end(`Method ${httpMethod} not allowed`)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
}