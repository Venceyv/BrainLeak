import { FC, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import TimeAgo from 'react-timeago';
import { PostComment } from '../../../interfaces/comment';
import { formatNumber } from '../../../utils/formatNumber';
import 'react-quill/dist/quill.bubble.css';
import './IndividualComment.css';
import { Replies } from './Replies';
import { NewComment } from '../../UserPost/components/NewComment';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getReplies, putEditComment } from '../../../api/commentAPI';
import { useParams } from 'react-router-dom';
import { fallback } from '../../../utils/imgFallback';
import { LikeThumb } from '../../../components/LikeThumb';
import { DislikeThumb } from '../../../components/DislikeThumb';
import { useMutateUserComment } from './IndividualComment.hook';
import Popup from 'reactjs-popup';

export const IndividualComment: FC<{
  comment: PostComment;
  currentUserId: string | null;
  pinnedComment: string | null;
  isPostAuthor: boolean;
}> = ({
  comment,
  currentUserId,
  pinnedComment,
  isPostAuthor,
}): JSX.Element => {
  const { postId } = useParams();
  const [showReply, setShowReply] = useState<boolean>(false);
  const [showUserReply, setShowUserReply] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] =
    useState<boolean>(false);
  const [postComment, setPostComment] =
    useState<PostComment>(comment);

  const {
    putLikeMutation,
    putDislikeMutation,
    putEditMutation,
    putDeleteMutation,
    putPinMutation,
  } = useMutateUserComment(
    comment.relatedPost,
    comment._id,
    setPostComment
  );

  const onDeleteComment = () => {
    putDeleteMutation.mutate();
    setShowConfirmDelete(false);
  };

  return (
    <div className="pl-4 w-full mb-3">
      <div className="flex items-center justify-start gap-2 col-span-2">
        <img
          className="w-[32px] h-[32px] rounded-full border-2 cursor-pointer border-border-black text-zinc-50"
          src={comment.author.avatar}
          onError={fallback}
          alt="profile picture"
        />
        <p className="text-sm cursor-pointer truncate text-white">
          {comment.author.username}
        </p>
        <div className="pt-[8px] h-[calc(100%-2px)] text-xs text-white">
          *
        </div>
        <TimeAgo
          className="text-xs pt-[2px] text-white opacity-90"
          date={comment.publishDate}
        />
        {comment.edited && (
          <div className="text-xs pt-[2px] text-white opacity-90">
            Edited
          </div>
        )}

        {currentUserId === comment.author._id && (
          <img
            src="../../../assets/img/edit.svg"
            alt="edit"
            className="w-6 h-6 ml-2 cursor-pointer"
            title="edit"
            onClick={() => setShowEdit((prev) => !prev)}
          />
        )}

        {/*  */}
        {pinnedComment === comment._id && (
          <img
            src="../../../assets/img/pin-fill.svg"
            alt="pin"
            className="w-7 h-7"
          />
        )}

        {currentUserId === comment.author._id && (
          <Popup
            open={showConfirmDelete}
            className="bg-opacity-90"
            trigger={
              <img
                src="../../../assets/img/delete.svg"
                alt="delete"
                className="w-6 h-6 ml-auto mr-2 cursor-pointer"
                title="delete"
                onClick={() => setShowConfirmDelete(true)}
              />
            }
            onClose={() => setShowConfirmDelete(false)}
            onOpen={() => setShowConfirmDelete(true)}
            closeOnDocumentClick
            modal
          >
            <div className="flex flex-col gap-4 w-[320px]">
              <img
                src="../../../assets/img/confirmation.png"
                alt="confirmation image"
                className="w-[320px]"
              />
              <p className="text-2xl text-white">
                Wait! Are you sure you want to delete this comment?
              </p>
              <div className="flex px-4 text-white ">
                <button
                  className="border-2 rounded-md p-1 transition-all ease-in-out hover:border-red-secondary hover:text-red-secondary border-border-black"
                  onClick={onDeleteComment}
                >
                  For sure
                </button>
                <button
                  className="ml-auto border-2 rounded-md p-1 transition-all ease-in-out hover:border-red-secondary hover:text-red-secondary border-border-black"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Actually, no
                </button>
              </div>
            </div>
          </Popup>
        )}
      </div>

      <div className="flex flex-col gap-3 border-l-2 pl-6 ml-[14px] mt-2 text-sm border-border-black text-white">
        <ReactQuill theme="bubble" value={comment.content} readOnly />

        <div className="flex gap-3 mb-2">
          <div className="flex gap-3">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => putLikeMutation.mutate()}
            >
              {/* <img
                src="../../../assets/img/like.svg"
                className="w-5 h-5 cursor-pointer"
                alt="like"
              /> */}
              <LikeThumb isTrue={postComment.like ? true : false} />
              <p className="truncate pl-[2px] pt-[1px] text-sm text-white">
                {postComment.statistics.likes}
              </p>
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => putDislikeMutation.mutate()}
            >
              {/* <img
                src="../../../assets/img/dislike.svg"
                className="w-5 h-5 cursor-pointer"
                alt="dislike"
              /> */}
              <DislikeThumb
                isTrue={postComment.dislike ? true : false}
              />
              <p className="truncate pl-[2px] pt-[1px] text-sm text-white">
                {postComment.statistics.dislikes}
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

            {isPostAuthor && pinnedComment !== comment._id && (
              <div
                className="flex items-center cursor-pointer"
                onClick={() => putPinMutation.mutate()}
              >
                <img
                  src="../../../assets/img/pin.svg"
                  alt="pin"
                  className="w-4 h-4 cursor-pointer"
                  title="pin"
                />

                <p className="truncate pl-[2px] pt-[1px] text-sm text-white">
                  Pin
                </p>
              </div>
            )}

            {isPostAuthor && pinnedComment === comment._id && (
              <div
                className="flex items-center cursor-pointer"
                onClick={() => putPinMutation.mutate()}
              >
                <img
                  src="../../../assets/img/pin.svg"
                  alt="pin"
                  className="w-4 h-4 cursor-pointer"
                  title="pin"
                />

                <p className="truncate pl-[2px] pt-[1px] text-sm text-white">
                  Unpin
                </p>
              </div>
            )}
          </div>
        </div>
        {showReply && (
          <NewComment
            postId={postId!}
            commentId={comment._id}
            commentUserId={comment.author._id}
            isReply={true}
            content={''}
            setShowReply={setShowReply}
          />
        )}
        {showEdit && (
          <NewComment
            postId={postId!}
            commentId={comment._id}
            commentUserId={comment.author._id}
            isReply={false}
            isEdit={true}
            content={comment.content ? comment.content : ''}
            setShowEdit={setShowEdit}
          />
        )}
        {showUserReply && (
          <div
            onClick={() => setShowUserReply((prev) => !prev)}
            className="cursor-pointer text-white"
          >
            Hide comment
          </div>
        )}
        {showUserReply && (
          <Replies
            commentId={comment?._id}
            currentUserId={currentUserId}
          />
        )}

        {!showUserReply && comment.statistics.replies > 0 && (
          <div
            className="cursor-pointer text-white"
            onClick={() => setShowUserReply((prev) => !prev)}
          >
            Load comments...
          </div>
        )}
      </div>
    </div>
  );
};
