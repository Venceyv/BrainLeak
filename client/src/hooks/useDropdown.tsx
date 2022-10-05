import { useRef, useState } from 'react';

//Toggle user dropdown
const useDropDown = () => {
    const userRef = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;
    const [dropdown, setDropdown] = useState<boolean>(false);

    const setUserDropDown = (dropdownState:boolean) => {
      setDropdown(dropdownState);
    }

    const toggleUserDropDown = () => {
      setDropdown(prev => !prev);
    }
  
    return { userRef, dropdown, toggleUserDropDown, setUserDropDown};
  };

export default useDropDown;