import type { NextApiRequest, NextApiResponse } from 'next';
import { SerializedSortingGame, updateSortingGame } from '../../../lib/server/sortingGame';
import { entityMessageCreator } from '../../../utils/api-messages';
import { errorMessageHandler } from '../../../utils/error-message-handler';

const entityMessageObj = entityMessageCreator('sortingGame');

// for updating
export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const httpMethod = req.method;
    const gameId = req.query.id as string;

    // TODO: GET, DELETE
    if (httpMethod == 'PUT') {
      const sortingGame: SerializedSortingGame = req.body;

      const updatedGame = await updateSortingGame(gameId, sortingGame);
      res.status(200).json({ message: entityMessageObj.updateSuccess, data: updatedGame });
    } else {
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${httpMethod} not allowed`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: errorMessageHandler({ httpMethod: req.method, isSingleEntity: true }, entityMessageObj) });
  }
};

export default handler;
