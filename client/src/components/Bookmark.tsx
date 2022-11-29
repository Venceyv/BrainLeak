import { FC } from 'react';

interface BookmarkProp {
  isTrue: boolean;
}

export const Bookmark: FC<BookmarkProp> = ({
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
      p-id="24079"
      width="64"
      height="64"
    >
      <path
        d="M858.256 384l-148.64 336H624v-112h-79.376v239.088l-95.984-61.056L352 847.088V608h-79.36v112h-68.96C178.512 720 144 719.888 144 617.664 144 512.128 179.92 512 203.68 512h507.584l227.52-464H435.52c-86.992 0-126.176 34.96-172.016 103.312-55.792 83.184-111.584 190.624-182.464 359.52C67.584 542.752 64 582.416 64 618.336c0 158.368 75.376 181.584 151.52 181.584 19.504 0 41.136-0.16 57.12-0.16V992.8l176-111.968L624 992.8V800h137.728L945.6 384h-87.344z m-528.32-188.88C366.16 141.12 382.368 128 435.52 128h375.04l-149.216 304H202.176c44.528-96 88.64-178.56 127.76-236.88z"
        fill="currentColor"
        p-id="24080"
      ></path>
    </svg>
  );
};
