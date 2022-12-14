import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FC } from 'react';
import Popup from 'reactjs-popup';
import { getCheckAuth, putFollowUser } from '../../../api/userAPI';
import { PencilSVG } from '../../../components/PencilSVG';
import { User } from '../../../interfaces/user';
import { queryClient } from '../../../main';
import { errorToast, successToast } from '../../../utils/errorToast';
import { formatNumber } from '../../../utils/formatNumber';
import { getUserId } from '../../../utils/getLocalStorage';
import { EditProfile } from './EditProfile';

export const BackgroundCard: FC<User> = (user) => {
  const { data } = useQuery(
    ['checkUserAuth'],
    () => getCheckAuth(getUserId()),
    {
      retry: 0,
    }
  );

  const isAuthor = data && user._id === data._id;

  return (
    <div className="relative z-0 flex flex-col items-end h-full text-white w-[1024px] bg-post-bg-black">
      <div className="peer absolute top-0 z-[1] h-[240px] w-full bg-gradient-to-b from-transparent to-post-bg-black"></div>
      <img
        src={user?.backgroundCover}
        alt="background"
        className="z-0 object-cover h-[240px] w-full peer"
      />
      {isAuthor && (
        <Popup
          // open={showConfirmDelete}
          className="bg-opacity-90"
          trigger={
            <div className="opacity-50 hover:opacity-100 absolute group z-[2] flex flex-row rounded-md p-1 gap-2 top-2 right-2 cursor-pointer transition-all ease-in-out duration-300 shadow shadow-border-black text-white bg-secondary-black hover:pl-2">
              <p className="pt-1 hidden group-hover:block">
                Edit Background
              </p>
              <div className="transition-all ease-in-out duration-300 fill-white group-hover:fill-red-secondary ">
                <PencilSVG />
              </div>
            </div>
          }
          // onClose={() => setShowConfirmDelete(false)}
          // onOpen={() => setShowConfirmDelete(true)}
          closeOnDocumentClick
          modal
        >
          <div className="flex flex-col gap-4 w-[320px]">
            <EditProfile userId={user._id} />
            <button
              className="border-2 rounded-md p-1 transition-all ease-in-out hover:border-red-secondary hover:text-red-secondary border-border-black"
              // onClick={onDeleteComment}
            >
              For sure
            </button>
            <button
              className="ml-auto border-2 rounded-md p-1 transition-all ease-in-out hover:border-red-secondary hover:text-red-secondary border-border-black"
              // onClick={() => setShowConfirmDelete(false)}
            >
              Actually, no
            </button>
          </div>
        </Popup>
      )}

      <div className="absolute z-[2] bottom-4 text-5xl w-1/2 h-[55px] pt-[6px] left-[380px] m-0 truncate text-transparent bg-clip-text bg-gradient-to-bl font-bold from-[#D7E1EC] to-white">
        {user?.username}
      </div>
    </div>
  );
};
