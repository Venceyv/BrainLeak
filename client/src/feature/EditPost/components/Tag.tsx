import { FC, useState } from 'react';

interface TagItemProp {
  tagName: string;
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export const TagItem: FC<TagItemProp> = ({ tagName, setTags }) => {
  const deleteTag = () => {
    setTags((prev) => prev.filter((tag) => tag !== tagName));
  };

  return (
    <div className="flex flex-row gap-1 text-sm capitalize px-2 pt-[2px] rounded-md border-2 border-border-black bg-secondary-black">
      <p>{tagName}</p>
      <img
        src="../../../assets/img/close-tag.svg"
        alt="close"
        className="w-3 cursor-pointer"
        onClick={deleteTag}
      />
    </div>
  );
};
