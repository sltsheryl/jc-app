import { Prisma, GameType, AssetType, SortingGame, Image } from '@prisma/client';
import s3 from 'aws-sdk/clients/s3';
import { deleteOldAsset } from './asset';
import prisma from '../prisma';

export type Bucket = {
  text: string;
  items: string[];
};

export type SerializedSortingGame = SortingGame & {
  buckets: Bucket[];
};

export const createSortingGame = async (sortingGame: SerializedSortingGame) => {
  return await prisma.sortingGame.create({
    data: {
      ...sortingGame,
      buckets: {
        create: sortingGame.buckets.map(bucket => ({
          text: bucket.text,
          items: { set: bucket.items },
        })),
      },
    },
  });
};

export const findUniqueSortingGame = async (gameId: string) => {
  return await prisma.sortingGame.findUnique({
    where: {
      gameId: gameId,
    },
    include: {
      buckets: true,
    },
  });
};

export const updateSortingGame = async (gameId: string, sortingGame: SerializedSortingGame) => {
  return await prisma.sortingGame.update({
    where: {
      gameId: gameId,
    },
    data: {
      ...sortingGame,
      buckets: {
        deleteMany: {},
        create: sortingGame.buckets.map(bucket => ({
          text: bucket.text,
          items: { set: bucket.items },
        })),
      },
    },
    include: {
      buckets: true,
    },
  });
};

export const deleteSortingGame = async (gameId: string) => {
  return await prisma.sortingGame.delete({
    where: {
      gameId: gameId,
    },
  });
};
