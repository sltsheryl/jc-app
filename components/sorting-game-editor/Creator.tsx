import { AddIcon } from '@chakra-ui/icons';
import { Flex, FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import { UseFormReturn } from 'react-hook-form';
import { SerializedSortingGame } from '../../lib/server/sortingGame';
import UploadImageButtonWithPreview from '../UploadImageButtonWithPreview';
import ImageWithUploadableFile from '../UploadImageButtonWithPreview';

type SortingGameCreatorProp = {
  useFormReturns: UseFormReturn<any>;
};

export type EditorSerializedSortingGame = Omit<SerializedSortingGame, 'images'> & {
  images: (typeof ImageWithUploadableFile)[];
};

export const NUM_SORTING_IMAGES = 6;

const SortingGameCreator = ({ useFormReturns }: SortingGameCreatorProp) => {
  const {
    register,
    formState: { errors },
  } = useFormReturns as UseFormReturn<{ sortingGame: { images: (typeof ImageWithUploadableFile)[] } }>;
  return (
    <Flex flexDir='column' gap={2} fontSize={14} fontFamily='Open Sans' fontWeight={400} px='3rem' bg='#E6E6E6' borderRadius={16} py={8}>
      <Text fontWeight={700} mb={5}>
        Sorting Game
      </Text>
      <div className='rounded-lg bg-white p-8'>
        <div className={`grid grid-flow-row grid-cols-2 items-start gap-4`}>
          {Array.from({ length: NUM_SORTING_IMAGES }, (_, index) => (
            <div key={index}>
              <Flex>
                <Text fontWeight={700} mb={2}>
                  {`Image ${index + 1}`}
                </Text>
                <Text>&nbsp;*</Text>
              </Flex>
              <div className='flex justify-start'>
                <UploadImageButtonWithPreview
                  registerLabel={`sortingGame.images.${index}`}
                  useFormReturns={useFormReturns}
                  isCroppable={true}
                  imageHeight='300'
                  imageWidth='300'
                />
              </div>
            </div>
          ))}
        </div>
        <div className='mt-4'></div>
      </div>
    </Flex>
  );
};

export default SortingGameCreator;
