import { Prisma, GameType, AssetType, SortingGame, QuizGameOptionType, Image } from '@prisma/client';
import s3 from 'aws-sdk/clients/s3';
import { NUM_SORTING_IMAGES } from '../../components/sorting-game-editor/Creator';
import prisma from '../prisma';
import { deleteOldAsset } from './asset';

export type SerializedSortingGame = {
  duration: number;
  images: Image[];
};

export const createSortingGame = async ({ duration, images }: SerializedSortingGame) => {
  return (await prisma.sortingGame.create({
    data: {
      game: {
        create: {
          type: GameType.sortingGame,
          asset: {
            create: {
              assetType: AssetType.game,
            },
          },
        },
      },
      images: {
        create: images.map(({ assetId }, idx) => ({
          index: idx,
          image: {
            connect: {
              assetId: assetId,
            },
          },
        })),
      },
    },
  })) as SortingGame;
};

export const findUniqueSortingGame = async (gameId: string) => {
  return await prisma.sortingGame.findUnique({
    where: {
      gameId: gameId,
    },
    include: {
      images: {
        include: {
          image: true,
        },
        orderBy: {
          index: 'asc',
        },
      },
    },
  });
};

export const updateSortingGame = async (gameId: string, { images }: SerializedSortingGame) => {
  // in a prisma transaction, first get all the old images, delete them from s3, then only update the images
  return await prisma.$transaction(async tx => {
    const oldImages = (
      await tx.sortingGame.findUnique({
        where: {
          gameId: gameId,
        },
        include: {
          images: {
            include: {
              image: true,
            },
            orderBy: {
              index: 'asc',
            },
          },
        },
      })
    ).images;
    for (let i = 0; i < NUM_SORTING_IMAGES; i++) {
      if (oldImages[i].image.assetId !== images[i].assetId) {
        deleteOldAsset(oldImages[i].image.assetId, AssetType.image, tx);
      }
    }
    return await prisma.sortingGame.update({
      where: {
        gameId: gameId,
      },
      data: {
        images: {
          deleteMany: {},
          create: images.map(({ assetId }, idx) => ({
            index: idx,
            image: {
              connect: {
                assetId: assetId,
              },
            },
          })),
        },
      },
    });
  });
};

export const deleteSortingGame = async (gameId: string) => {
  return await prisma.$transaction(async tx => {
    const oldImages = (
      await tx.sortingGame.findUnique({
        where: {
          gameId: gameId,
        },
        include: {
          images: {
            include: {
              image: true,
            },
            orderBy: {
              index: 'asc',
            },
          },
        },
      })
    ).images;
    for (let i = 0; i < NUM_SORTING_IMAGES; i++) {
      deleteOldAsset(oldImages[i].image.assetId, AssetType.image, tx);
    }
    return await prisma.sortingGame.delete({
      where: {
        gameId: gameId,
      },
    });
  });
};
