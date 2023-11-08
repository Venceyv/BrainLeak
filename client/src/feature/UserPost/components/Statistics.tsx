import { FC } from 'react';
import { formatNumber } from '../../../utils/formatNumber';

export const Statistics: FC<{
  view: number;
  comment: number;
  marks: number;
}> = ({ view, comment, marks }): JSX.Element => {
  return (
    <div className="flex gap-4 mt-5 w-full">
      <div className="flex justify-center items-center gap-1">
        <img
          src="../../../assets/img/view.svg"
          className="w-6 h-6"
          alt="views"
        />
        <p className="text-sm pt-[1px] text-white">
          {formatNumber(view)} Views
        </p>
      </div>
      <div className="flex justify-center items-center gap-1">
        <img
          src="../../../assets/img/comment.svg"
          className="w-6 h-6"
          alt="comments"
        />
        <p className="text-sm pt-[1px] text-white">
          {formatNumber(comment)} Comments
        </p>
      </div>
      <div className="flex justify-center items-center gap-1">
        <img
          src="../../../assets/img/bookmark.svg"
          className="w-6 h-6"
          alt="bookmarked"
        />
        <p className="text-sm pt-[1px] text-white">
          {formatNumber(marks)} Bookmarked
        </p>
      </div>
    </div>
  );
};

// like
// dislike
// comments
// marks
// views
