import { FC } from 'react';

interface LikeThumbProp {
  isTrue: boolean;
}

export const LikeThumb: FC<LikeThumbProp> = ({
  isTrue,
}): JSX.Element => {
  return (
    <svg
      className={`icon w-5 h-5 ${
        isTrue ? 'fill-red-secondary' : 'fill-white'
      }`}
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="1447"
      width="64"
      height="64"
    >
      <path
        d="M799.36 371.2h-99.2c-9.6 0-18.56-4.48-24.96-12.16a30.56 30.56 0 0 1-6.4-26.24l24.32-95.36c7.68-34.56-0.64-70.4-23.04-97.92A114.976 114.976 0 0 0 579.84 96c-54.4 0-101.76 38.4-113.28 90.88l-24.96 109.44c-10.24 46.72-51.2 74.88-109.44 74.88h-23.68C292.48 341.12 260.48 320 224 320H192c-53.12 0-96 42.88-96 96v416c0 53.12 42.88 96 96 96h32c53.12 0 96-42.88 96-96V435.2h12.16c87.68 0 154.88-49.28 172.16-124.8l24.32-109.44c5.12-23.68 26.88-40.96 51.2-40.96 16 0 30.72 7.04 40.96 19.84 9.6 12.16 13.44 28.16 10.24 42.88l-24.32 95.36a95.52 95.52 0 0 0 93.44 116.48h99.2c35.84 0 64.64 28.8 64.64 64.64v90.88c0 133.12-108.16 241.28-241.28 241.28H384v64h238.72c168.32 0 305.28-136.96 305.28-305.28v-90.24c0-71.04-57.6-128.64-128.64-128.64zM256 832c0 17.92-14.08 32-32 32H192c-17.92 0-32-14.08-32-32V416c0-17.92 14.08-32 32-32h32c17.92 0 32 14.08 32 32v416z"
        p-id="1448"
      ></path>
    </svg>
  );
};
