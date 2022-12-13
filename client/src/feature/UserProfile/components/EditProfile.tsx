import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FC, useState } from 'react';
import { putUserAvatar } from '../../../api/userAPI';
import { queryClient } from '../../../main';
import { errorToast, successToast } from '../../../utils/errorToast';

export const EditProfile: FC<{ userId: string }> = ({ userId }) => {
  const [selectedImage, setSelectedImage] = useState<FormData>();
  const [displayImage, setDisplayImage] = useState<string>();

  const putUserAvatarMutation = useMutation(
    ['putUserAvatar'],
    () => putUserAvatar(userId, selectedImage),
    {
      onSuccess: () => {
        console.log(selectedImage);
        successToast('Success!');
        queryClient.invalidateQueries(['userData']);
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
    <div className="flex flex-col gap-4 text-white">
      {displayImage && <img src={displayImage} />}
      <input
        type="file"
        onChange={onFileSelect}
        className="w-full text-xs hover:file:cursor-pointer text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-post-bg-black hover:file:bg-border-black hover:file:text-white"
      />
      <button
        type="button"
        onClick={() => putUserAvatarMutation.mutate()}
      >
        Change!!
      </button>
    </div>
  );
};
