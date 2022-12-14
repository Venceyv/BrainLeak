import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FC, useState } from 'react';
import Popup from 'reactjs-popup';
import { getCheckAuth, putFollowUser } from '../../../api/userAPI';
import { PencilSVG } from '../../../components/PencilSVG';
import { User } from '../../../interfaces/user';
import { queryClient } from '../../../main';
import { errorToast, successToast } from '../../../utils/errorToast';
import { formatNumber } from '../../../utils/formatNumber';
import { getUserId } from '../../../utils/getLocalStorage';
import { EditProfile } from './EditProfile';
import { EditProfileBackground } from './EditProfileBackground';
import { EditProfileUser } from './EditProfileUser';

export const UserCard: FC<User> = (user) => {
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showUserEdit, setUserShowEdit] = useState<boolean>(false);

  const { data, isSuccess } = useQuery(
    ['checkUserAuth'],
    () => getCheckAuth(getUserId()),
    {
      retry: 0,
    }
  );

  const putFollowUserMutation = useMutation(
    ['putFollowUser'],
    () => putFollowUser(user._id),
    {
      onSuccess: () => {
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

  const isAllowFollow =
    !data || (data._id !== user._id && user.following === false);

  const isAuthor = data && user._id === data._id;

  return (
    <div className="absolute left-[70px] top-[110px] flex flex-col items-center gap-2 w-[280px] h-fit rounded-md shadow shadow-border-black text-white bg-gradient-to-b from-post-bg-black to-secondary-black">
      <img
        src={
          !user.isDelete
            ? user.avatar
            : '../../assets/img/user-not-found.webp'
        }
        alt="user avatar"
        className="w-full h-[300px] object-cover rounded-tl-md rounded-tr-md"
      />
      {isAuthor && !user.isDelete && (
        <Popup
          open={showEdit}
          className=""
          trigger={
            <div className="opacity-50 hover:opacity-100 absolute group z-[2] flex flex-row rounded-md p-1 gap-2 top-2 right-2 cursor-pointer transition-all ease-in-out duration-300 shadow shadow-border-black text-white bg-secondary-black hover:pl-2">
              <p className="pt-1 hidden group-hover:block">
                Edit Avatar
              </p>
              <div className="transition-all ease-in-out duration-300 fill-white group-hover:fill-red-secondary ">
                <PencilSVG />
              </div>
            </div>
          }
          onClose={() => setShowEdit(false)}
          onOpen={() => setShowEdit(true)}
          closeOnDocumentClick
          modal
        >
          <div className="flex flex-col gap-4 w-[320px]">
            <EditProfile
              userId={user._id}
              setShowEdit={setShowEdit}
            />
          </div>
        </Popup>
      )}

      {data?._id !== user._id && !user.isDelete && (
        <div
          className="absolute top-[250px] right-[10px] flex flex-row rounded-3xl py-1 px-4 shadow cursor-pointer shadow-border-black text-white bg-secondary-black"
          onClick={() => putFollowUserMutation.mutate()}
        >
          {isAllowFollow ? (
            <p className="pt-[3px]">Follow</p>
          ) : (
            <p className="pt-[3px]">Unfollow</p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-6 p-6 w-full">
        {/* about */}
        <div className="flex flex-col justify-start w-full gap-1 text-white">
          <div className="flex flex-row">
            <p className="text-sm font-bold h-[24px]">ABOUT</p>
            {isAuthor && !user.isDelete && (
              <Popup
                open={showUserEdit}
                trigger={
                  <div className="opacity-50 hover:opacity-100 h-[14px] px-1 ml-auto group z-[2] flex flex-row rounded-md gap-2 cursor-pointer transition-all ease-in-out duration-300 shadow shadow-border-black text-white bg-secondary-black">
                    <p className="text-[10px] hidden group-hover:block">
                      Edit Information
                    </p>
                    <div className="transition-all ease-in-out h-fit duration-300 fill-white group-hover:fill-red-secondary ">
                      <PencilSVG size={'12'} />
                    </div>
                  </div>
                }
                onClose={() => setUserShowEdit(false)}
                onOpen={() => setUserShowEdit(true)}
                closeOnDocumentClick
                modal
              >
                <div className="flex flex-col gap-4 w-[320px]">
                  <EditProfileUser
                    user={user}
                    setUserShowEdit={setUserShowEdit}
                  />
                </div>
              </Popup>
            )}
          </div>
          <div className="mt-1 text-sm min-h-[48px] break-words">
            {user.introduction}
          </div>
        </div>

        {/* stats */}
        <div className="flex flex-col items-start justify-center gap-1 mt-2 w-full text-sm text-white">
          <div className="flex flex-row w-full gap-1">
            <p>FOLLOWERS </p>
            <p className="font-bold align-middle text-center truncate ml-auto">
              {formatNumber(user.statistics?.follower)}
            </p>
          </div>
          <div className="flex flex-row w-full gap-1">
            <p>FOLLOWING </p>
            <p className="font-bold align-middle text-center truncate ml-auto">
              {formatNumber(user.statistics?.following)}
            </p>
          </div>
          <div className="flex flex-row w-full gap-1 ">
            <p>POSTS </p>
            <p className="align-middle font-bold text-center truncate ml-auto">
              {formatNumber(user.statistics?.posts)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
