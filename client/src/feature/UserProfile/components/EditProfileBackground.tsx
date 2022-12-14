import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FC, useState } from 'react';
import {
  putUserAvatar,
  putUserBackground,
} from '../../../api/userAPI';
import { queryClient } from '../../../main';
import { errorToast, successToast } from '../../../utils/errorToast';

export const EditProfileBackground: FC<{
  userId: string;
  setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ userId, setShowEdit }) => {
  const [selectedImage, setSelectedImage] = useState<FormData>();
  const [displayImage, setDisplayImage] = useState<string>();

  const putUserBackgroundMutation = useMutation(
    ['putUserBackground'],
    () => putUserBackground(userId, selectedImage),
    {
      onSuccess: () => {
        console.log(selectedImage);
        successToast('Success!');
        queryClient.invalidateQueries(['userData']);
        setShowEdit(false);
      },
      onError: (err: AxiosError) => {
        if (err?.response?.status === 401) {
          errorToast('Please Login First');
        } else {
          errorToast('An error has occurred');
        }
      },
    }
  );

  const onFileSelect = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.files) {
      const formData = new FormData();
      formData.append('avatar', ev?.target?.files[0]);

      setSelectedImage(formData);
      setDisplayImage(URL.createObjectURL(ev?.target?.files[0]));
    }
  };

  return (
    <div className="flex flex-col items-center rounded-md shadow shadow-border-black gap-4 p-4 w-[400px] max-h-[400px] bg-post-bg-black text-white">
      {displayImage && (
        <div className="flex flex-col gap-2 items-center">
          <p>Preview </p>
          <img
            src={displayImage}
            className="max-h-[200px] max-w-[300px]"
          />
        </div>
      )}
      <input
        type="file"
        onChange={onFileSelect}
        className="w-full text-xs hover:file:cursor-pointer text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-post-bg-black hover:file:bg-border-black hover:file:text-white"
      />
      <button
        type="button"
        className="w-fit px-3 py-1 rounded-full mt-auto font-semibold hover:bg-border-black hover:text-white text-post-bg-black bg-white"
        onClick={() => putUserBackgroundMutation.mutate()}
      >
        Change!!
      </button>
    </div>
  );
};
