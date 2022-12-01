import { FC, useState } from 'react';
import ReactQuill from 'react-quill';
import TimeAgo from 'react-timeago';
import {
  CommentReply,
  PostComment,
} from '../../../interfaces/comment';
import { formatNumber } from '../../../utils/formatNumber';
import 'react-quill/dist/quill.bubble.css';
import './IndividualComment.css';
import { Replies } from './Replies';
import { NewComment } from '../../UserPost/components/NewComment';
import { fallback } from '../../../utils/imgFallback';

export const IndividualReply: FC<CommentReply> = (
  reply
): JSX.Element => {
  const [showReply, setShowReply] = useState<boolean>(false);
  return (
    <div className="pl-4 w-full mb-2">
      <div className="flex items-center justify-start gap-2 col-span-2">
        <img
          className="w-[32px] h-[32px] rounded-full border-2 cursor-pointer border-border-black text-zinc-50"
          src={reply.author.avatar}
          onError={fallback}
          alt="profile picture"
        />
        <p className="text-sm cursor-pointer truncate text-white">
          {reply.author.username}
        </p>
        <div className="pt-[8px] h-[calc(100%-2px)] text-xs text-white">
          *
        </div>
        <TimeAgo
          className="text-xs pt-[2px] text-white opacity-90"
          date={reply.publishDate}
        />
      </div>

      <div className="ml-10 text-[10px] text-opacity-80 w-fit hover:underline cursor-pointer text-white">
        @{reply.mentionedUser.username}
      </div>
      <div className="flex flex-col gap-4 border-l-2 pl-6 ml-[14px] mt-2 text-sm border-border-black text-white">
        <ReactQuill theme="bubble" value={reply.content} readOnly />

        <div className="flex gap-3 mb-2">
          <div className="flex gap-3">
            <div className="flex items-center">
              <img
                src="../../../assets/img/like.svg"
                className="w-5 h-5 cursor-pointer"
                alt="like"
              />
              <p className="truncate pl-[2px] pt-[1px] text-sm text-white">
                {reply.statistics.likes}
              </p>
            </div>
            <div className="flex items-center">
              <img
                src="../../../assets/img/dislike.svg"
                className="w-5 h-5 cursor-pointer"
                alt="dislike"
              />
              <p className="truncate pl-[2px] pt-[1px] text-sm text-white">
                {reply.statistics.dislikes}
              </p>
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setShowReply((prev) => !prev)}
            >
              <img
                src="../../../assets/img/pencil.svg"
                className="w-5 h-5 cursor-pointer"
                alt="dislike"
              />
              <p className="truncate pl-[2px] pt-[1px] text-sm text-white">
                Reply
              </p>
            </div>
          </div>
        </div>
        {showReply && (
          <NewComment
            postId={reply.relatedPost}
            commentId={reply.relatedComment}
            commentUserId={reply.author._id}
            isReply={true}
          />
        )}
      </div>
    </div>
  );
};

// COMMENT DATE WRONG
