import { FC } from 'react';

interface DislikeThumbProp {
  isTrue: boolean;
}

export const DislikeThumb: FC<DislikeThumbProp> = ({
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
      p-id="2424"
      width="64"
      height="64"
    >
      <path
        d="M622.72 128H384v64h238.72C755.84 192 864 300.16 864 433.28v90.88c0 35.2-28.8 64.64-64.64 64.64h-99.2c-29.44 0-56.32 12.8-74.88 35.84-18.56 23.04-24.96 52.48-18.56 81.92l23.68 94.08c3.2 15.36 0 31.36-10.24 44.16-10.24 12.8-24.96 19.84-40.96 19.84-24.96 0-45.44-16.64-51.2-40.96l-24.32-109.44c-16-76.16-83.84-125.44-171.52-125.44H320V192c0-53.12-42.88-96-96-96H192C138.88 96 96 138.88 96 192v416c0 53.12 42.88 96 96 96h32c36.48 0 68.48-21.12 84.48-51.2h24.32c58.24 0 99.2 28.16 109.44 74.88l24.32 109.44A115.648 115.648 0 0 0 579.84 928c35.2 0 68.48-16 90.88-43.52 22.4-27.52 30.72-63.36 22.4-98.56l-23.68-94.08c-1.92-9.6 0-19.2 6.4-26.88s15.36-12.16 24.96-12.16H800c71.04 0 128.64-57.6 128.64-128.64v-90.88C928 264.96 791.04 128 622.72 128zM224 640H192c-17.92 0-32-14.08-32-32V192c0-17.92 14.08-32 32-32h32c17.92 0 32 14.08 32 32v416c0 17.92-14.08 32-32 32z"
        p-id="2425"
      ></path>
    </svg>
  );
};