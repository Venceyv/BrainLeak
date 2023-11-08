import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FC, useState } from 'react';
import { putUser } from '../../../api/userAPI';
import { User } from '../../../interfaces/user';
import { queryClient } from '../../../main';
import { errorToast, successToast } from '../../../utils/errorToast';

export const EditProfileUser: FC<{
  user: User;
  setUserShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ user, setUserShowEdit }) => {
  const [username, setUsername] = useState<string>(user.username);
  const [description, setDescription] = useState<string>(
    user.introduction
  );
  const putUserMutation = useMutation(
    ['putUser'],
    () =>
      putUser(user._id, {
        username: username,
        introduction: description,
      }),
    {
      onSuccess: () => {
        successToast('Success!');
        queryClient.invalidateQueries(['userData']);
        setUserShowEdit(false);
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

  const onUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      target: { value },
    } = event;

    if (value.length > 29) return;

    setUsername(value);
  };

  const onDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const {
      target: { value },
    } = event;

    if (value.length > 199) return;

    setDescription(value);
  };

  return (
    <div className="flex flex-col items-center rounded-md shadow shadow-border-black gap-4 p-4 w-[400px] max-h-[400px] bg-post-bg-black text-white">
      <input
        className="h-[39px] mt-4 border-2 rounded-md p-2 pl-4 w-full bg-secondary-black text-white  border-border-black"
        type="text"
        placeholder="Username..."
        name="username"
        value={username}
        onChange={onUsernameChange}
      />
      <textarea
        className="mt-4 border-2 rounded-md p-2 pl-4 w-full h-[230px] resize-none bg-secondary-black text-white  border-border-black"
        placeholder="Description..."
        name="description"
        value={description}
        onChange={onDescriptionChange}
      />
      <button
        type="button"
        className="w-fit px-3 py-1 rounded-full mt-auto font-semibold hover:bg-border-black hover:text-white text-post-bg-black bg-white"
        onClick={() => putUserMutation.mutate()}
      >
        Change!!
      </button>
    </div>
  );
};
