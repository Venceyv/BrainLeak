const focusStyle = [
  'border-border-black',
  'bg-primary-black',
  'outline-none',
];
const removeStyle = 'border-secondary-black';

export const useApplyFocus = (
  buttonRef: React.RefObject<HTMLDivElement>
) => {
  const applyFocus = (index: number) => {
    const button = buttonRef?.current;
    let location = Number(sessionStorage.getItem('currMenuItemLoc'));

    if (location === 0 || location) {
      focusStyle.forEach((style) => {
        button?.children[location].classList.remove(style);
      });
      button?.children[location].classList.add(removeStyle);
    }

    sessionStorage.setItem('currMenuItemLoc', `${index}`);

    focusStyle.forEach((style) => {
      button?.children[index].classList.add(style);
    });
    button?.children[index].classList.remove(removeStyle);
  };

  return { applyFocus };
};
