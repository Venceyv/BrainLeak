import { useQuery } from '@tanstack/react-query';
import { FC, useRef } from 'react';
import { getUser } from '../../../api/userAPI';
import {
  CommentReply,
  PostComment,
} from '../../../interfaces/comment';
import { fallback } from '../../../utils/imgFallback';
import TimeAgo from 'react-timeago';
import { LikeThumb } from '../../../components/LikeThumb';
import ReactQuill from 'react-quill';
import { useLikePinComment } from './pinned.hook';

export const Pinned: FC<{
  pinnedComment: PostComment | CommentReply | null;
  postId: string;
}> = ({ pinnedComment, postId }): JSX.Element => {
  const { putLikeMutation } = useLikePinComment(
    postId,
    pinnedComment?._id!
  );
  return (
    <div className="relative z-[3] grid grid-cols-3 grid-rows-7 gap-1 py-3 w-[220px] h-[330px] rounded-md p-3 pb-1 border-2 bg-secondary-black border-border-black">
      <div className="absolute flex flex-col gap-2 z-[2] w-[220px] h-full rounded-md p-3 pt-6 pb-[0px] border-2 rotate-3 bg-secondary-black border-border-black">
        <div className="flex items-center justify-start gap-2 col-span-2">
          <img
            className="w-[32px] h-[32px] rounded-full border-2 cursor-pointer border-border-black text-zinc-50"
            src={pinnedComment?.author.avatar}
            onError={fallback}
            alt="profile picture"
          />
          <p className="text-sm cursor-pointer text-white">
            {pinnedComment?.author.username}
          </p>
          <div
            className="flex items-center cursor-pointer ml-auto"
            onClick={() => putLikeMutation.mutate()}
          >
            {/* <img
                src="../../../assets/img/like.svg"
                className="w-5 h-5 cursor-pointer"
                alt="like"
              /> */}
            <LikeThumb isTrue={pinnedComment?.like ? true : false} />
            <p className="truncate pl-[2px] pt-[1px] text-sm text-white">
              {pinnedComment?.statistics.likes}
            </p>
          </div>
        </div>
        <div className="overflow-hidden truncate">
          <ReactQuill
            theme="bubble"
            value={pinnedComment?.content}
            readOnly
          />
        </div>
      </div>
      <div className="absolute z-[1] w-[220px] h-[330px] rounded-md p-3 pb-[0px] border-2 rotate-[10deg] bg-secondary-black border-border-black"></div>
      <img
        src="../../../assets/img/clip.svg"
        alt="pin.svg"
        className="absolute w-14 h-14 z-[2] rotate-[35deg] translate-x-[100px] translate-y-[-25px]"
      />
    </div>
  );
};

// "https://storage.googleapis.com/brainleak/404(ghost).jpg"
// "https://storage.googleapis.com/brainleak/404%EF%BC%88cat).jpg"
// "https://storage.googleapis.com/brainleak/404(astronaut).jpg"
