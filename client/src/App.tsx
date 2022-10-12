import { useEffect } from 'react';
import useDropDown  from './hooks/useDropdown';
import { Navbar } from './components';
import {Posts} from './components';
import './App.css';

const App = () => {

  const {userRef, dropdown, setUserDropDown, toggleUserDropDown} = useDropDown();
  
  const detectOutsideClick = (event:globalThis.MouseEvent) => {

    // close dropdown iff outside of dropdown & not user icon & dropdown exist
    const target:HTMLImageElement = event.target as HTMLImageElement;
    if (userRef.current && !userRef.current.contains(event.target as Node) && !(target.id === 'user-img')) {
      setUserDropDown(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', (e:globalThis.MouseEvent)=> {
      detectOutsideClick(e);
    })
  }, [])
  
  return (
    <>
      <Navbar userRef={userRef} dropdown={dropdown} setUserDropDown={setUserDropDown} toggleUserDropDown={toggleUserDropDown}/>
      <div className="grid items-center h-[calc(100%-56px)] bg-primary-black text-white">
        <Posts />
      </div>
    </>
  );
};

export default App;
