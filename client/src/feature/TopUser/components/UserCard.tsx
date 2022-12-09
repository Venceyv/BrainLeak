import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUser } from "../../../interfaces/user";
import { formatNumber } from "../../../utils/formatNumber";
import { fallback } from "../../../utils/imgFallback";

// interface UserCardProp {
//   popularity: string;
//   user: TrendingUserType;
// }

export const UserCard: FC<TrendingUser> = (
  trendingUser
): JSX.Element => {
  const navigate = useNavigate();
  return (
    <div
      className="relative grid grid-cols-3 grid-rows-4 gap-1 py-3 overflow-hidden w-[270px] h-[160px] rounded-2xl p-3 pb-[0px] border-2 bg-secondary-black border-border-black cursor-pointer"
      onClick={() =>
        navigate(`/user/profile/${trendingUser.user._id}`)
      }
    >
      <img
        src={trendingUser.user.backgroundCover}
        className="absolute w-full h-11 z-[1] object-cover"
        alt="background cover"
      />

      <div className="absolute flex text-sm cursor-pointer w-[calc(100%-80px)] truncate top-[52px] left-[80px]">
        <p className="w-[100px] truncate text-white">
          {trendingUser.user.username}
        </p>

        <div className="flex pb-1 pr-1 items-end justify-end gap-1 ml-auto">
          <img
            src="../../../assets/img/hot.svg"
            alt="trending"
            className="w-5 h-5"
          />
          <p className="h-fit truncate text-sm tracking-wide align-middle pt-1">
            {formatNumber(trendingUser.popularity)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-start gap-2 col-span-2 row-span-2">
        <img
          className="w-[60px] h-[60px] mr-auto rounded-full border-2 cursor-pointer z-[2] border-border-black  text-zinc-50"
          src={trendingUser.user.avatar}
          onError={fallback}
          alt="profile picture"
        />
      </div>

      <p className="text-[13px] cursor-pointer col-span-3 row-span-1 text-center text-opacity-75 w-full truncate text-white">
        {trendingUser.user.introduction}
      </p>

      <div className="flex items-start justify-start col-span-3 row-span-1">
        <div className="flex w-[110px]">
          <img
            src="../../../assets/img/Postit.svg"
            className="w-6 h-6"
            alt="posts"
          />
          <p className="text-sm ml-1 align-middle text-center truncate pt-1">
            Posts: {formatNumber(trendingUser.user.postCount)}
          </p>
        </div>
        <div className="flex w-[130px] ml-3">
          <img
            src="../../../assets/img/follower.svg"
            className="w-6 h-6"
            alt="followers"
          />
          <p className="text-sm ml-1 align-middle text-center truncate pt-1">
            Followers: {formatNumber(trendingUser.user.followerCount)}
          </p>
        </div>
      </div>

      {/* <div className="flex pb-2 items-end justify-end gap-1">
        <img src="../../../assets/img/hot.svg" alt="trending" className="w-6" />
        <p className="h-fit truncate text-sm">Like count: {user.like}</p>
      </div> */}
    </div>
  );
};

// postcount
//followercount
