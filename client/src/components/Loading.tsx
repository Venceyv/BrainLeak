import { FC } from 'react';
import { MagnifyingGlass } from 'react-loader-spinner';

export const Loading: FC<{ width: string; height: string }> = ({ height = 'full', width = 'full' }): JSX.Element => {
  return (
    <div className={`flex justify-center w-${width} h-${height}`}>
      <MagnifyingGlass
        visible={true}
        height="80px"
        width="80px"
        ariaLabel="MagnifyingGlass-loading"
        wrapperStyle={{}}
        wrapperClass="MagnifyingGlass-wrapper"
        glassColor="#c0efff"
        color="#b1102b"
      />
    </div>
  );
};
