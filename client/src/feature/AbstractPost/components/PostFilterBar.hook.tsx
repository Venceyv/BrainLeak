const focusStyle = [
  'border-border-black',
  'bg-primary-black',
  'outline-none',
];
const removeStyle = 'border-secondary-black';

export const useApplyFocus = (
  buttonRef: React.RefObject<HTMLDivElement>,
  isFollowingMenu: boolean = false
) => {
  const applyFocus = (index: number) => {
    const button = buttonRef?.current;
    let location: number;
    if (isFollowingMenu === false) {
      location = Number(sessionStorage.getItem('currMenuItemLoc'));
    } else {
      location = Number(
        sessionStorage.getItem('currFollowingMenuItemLoc')
      );
    }

    if (location === 0 || location) {
      focusStyle.forEach((style) => {
        button?.children[location].classList.remove(style);
      });
      button?.children[location].classList.add(removeStyle);
    }

    if (isFollowingMenu === false) {
      sessionStorage.setItem('currMenuItemLoc', `${index}`);
    } else {
      sessionStorage.setItem('currFollowingMenuItemLoc', `${index}`);
    }

    focusStyle.forEach((style) => {
      button?.children[index].classList.add(style);
    });
    button?.children[index].classList.remove(removeStyle);
  };

  return { applyFocus };
};
