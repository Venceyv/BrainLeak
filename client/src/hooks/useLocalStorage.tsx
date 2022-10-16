import { useState } from 'react';

export const useLocalStorage = (strName: string): [()=>any, (a: string)=>void, ()=>void] => {
  const [dataName, setDataName] = useState<string>('');
  setDataName(strName);

  const setStorage = (inputData:any): void => {
    if (dataName) {
      localStorage.setItem(dataName, JSON.stringify(inputData));
    }
  };

  const getStorage = (): any => {
    return localStorage.getItem(dataName);
  };

  const removeStorage = (): void => {
    localStorage.removeItem(dataName);
  }

  return [getStorage, setStorage, removeStorage];
};

