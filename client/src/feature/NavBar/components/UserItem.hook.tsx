import { useEffect, useRef, useState } from 'react';

interface useDropdownReturn {
  userRef: React.MutableRefObject<HTMLDivElement>;
  isDropdown: boolean;
  toggleUserDropdown: React.MouseEventHandler<HTMLElement>;
  setUserDropdown: (dropdownState: boolean) => void;
}

export const useDetectOutsideClick = (
  userRef: React.MutableRefObject<HTMLDivElement>,
  setUserDropDown: (a: boolean) => void
) => {
  const detectOutsideClick = (event: globalThis.MouseEvent) => {
    // detect clicks outside dropdown
    const target: HTMLImageElement = event.target as HTMLImageElement;
    if (
      userRef.current &&
      !userRef.current.contains(event.target as Node) &&
      !(target.id === 'user-img')
    ) {
      setUserDropDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener(
      'mousedown',
      (e: globalThis.MouseEvent) => {
        detectOutsideClick(e);
      }
    );
  }, []);
};

export const useDropdown = (): useDropdownReturn => {
  const [isDropdown, setDropdown] = useState<boolean>(false);
  const userRef = useRef<HTMLDivElement>(
    null
  ) as React.MutableRefObject<HTMLDivElement>;

  const toggleUserDropdown: React.MouseEventHandler<
    HTMLElement
  > = (): void => {
    setDropdown((prev) => !prev);
  };
  const setUserDropdown = (dropdownState: boolean) => {
    setDropdown(dropdownState);
  };

  return { userRef, isDropdown, toggleUserDropdown, setUserDropdown };
};
