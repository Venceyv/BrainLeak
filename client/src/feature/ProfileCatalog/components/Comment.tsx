import { FC, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import TimeAgo from 'react-timeago';
import 'react-quill/dist/quill.bubble.css';
import './Comment.css';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { LikeThumb } from '../../../components/LikeThumb';
import { DislikeThumb } from '../../../components/DislikeThumb';
import { fallback } from '../../../utils/imgFallback';
import { PostComment } from '../../../interfaces/comment';

export const Comment: FC<{
  comment: PostComment;
}> = ({ comment }): JSX.Element => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [showReply, setShowReply] = useState<boolean>(false);
  const [showUserReply, setShowUserReply] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);

  return (
    <div className="pl-4 w-full mb-3">
      <div className="flex items-center justify-start gap-2 col-span-2">
        <img
          className="w-[32px] h-[32px] rounded-full border-2 cursor-pointer border-border-black text-zinc-50"
          src={comment?.author?.avatar}
          onError={fallback}
          alt="profile picture"
        />
        <p className="text-sm cursor-pointer truncate text-white">
          {comment?.author?.username}
        </p>
        <div className="pt-[8px] h-[calc(100%-2px)] text-xs text-white">
          *
        </div>
        <TimeAgo
          className="text-xs pt-[2px] text-white opacity-90"
          date={comment?.publishDate}
        />
        {comment?.edited && (
          <div className="text-xs pt-[2px] text-white opacity-90">
            Edited
          </div>
        )}
        <div
          className="text-xs pt-[2px] ml-4 hover:underline cursor-pointer text-white opacity-90"
          onClick={() =>
            navigate(`/post/${comment?.relatedPost?._id}`)
          }
        >
          {comment?.relatedPost?.title
            ? comment?.relatedPost?.title
            : 'Deleted'}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-l-2 pl-6 ml-[14px] mt-2 text-sm border-border-black text-white">
        <ReactQuill theme="bubble" value={comment.content} readOnly />

        <div className="flex gap-3 mb-2">
          <div className="flex gap-3">
            <div
              className="flex items-center cursor-pointer"
              // onClick={() => putLikeMutation.mutate()}
            >
              {/* <img
                src="../../../assets/img/like.svg"
                className="w-5 h-5 cursor-pointer"
                alt="like"
              /> */}
              <LikeThumb isTrue={comment.like ? true : false} />
              <p className="truncate pl-[2px] pt-[1px] text-sm text-white">
                {comment.statistics.likes}
              </p>
            </div>
            <div
              className="flex items-center cursor-pointer"
              // onClick={() => putDislikeMutation.mutate()}
            >
              {/* <img
                src="../../../assets/img/dislike.svg"
                className="w-5 h-5 cursor-pointer"
                alt="dislike"
              /> */}
              <DislikeThumb isTrue={comment.dislike ? true : false} />
              <p className="truncate pl-[2px] pt-[1px] text-sm text-white">
                {comment.statistics.dislikes}
              </p>
            </div>
            <div className="flex items-center">
              <img
                src="../../../assets/img/reply.svg"
                className="w-5 h-5"
                alt="reply"
              />
              <p className="truncate pl-[2px] pt-[1px] text-sm text-white">
                {comment.statistics.replies}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
