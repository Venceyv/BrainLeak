import { useState } from 'react';

const useLocalStorage = (dataName: string, data: string | object): [string, (a: string)=>string | object, (a: string, b: string | object)=>void, (a:string)=>void] => {
  // const [dataName, setDataName] = useState<string | Object>('');
  const setStorage = (dataName:string, inputData:string | object): void => {
    if (dataName != null) {
      localStorage.setItem(dataName, JSON.stringify(inputData));
    }
  };

  const getStorage = (dataName: string): any => {
    return localStorage.getItem(dataName);
  };

  const removeStorage = (dataName: string): void => {
    localStorage.removeItem(dataName);
  }

  return [dataName, getStorage, setStorage, removeStorage]; 
};

export default useLocalStorage;
