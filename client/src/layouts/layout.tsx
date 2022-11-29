import { FC, useEffect, useRef } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { NavBar } from '../feature/NavBar';

export const Layout: FC = (): JSX.Element => {
  const hasParam = useParams();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Object.keys(hasParam).length > 0) {
      containerRef?.current?.classList.add('overflow-hidden');
    } else {
      containerRef?.current?.classList.remove('overflow-hidden');
    }
  });
  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-primary-black"
    >
      <NavBar />
      <Outlet />
    </div>
  );
};
