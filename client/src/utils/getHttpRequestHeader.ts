export const getRequestHeader: Function = (): {'Authorization':string, 'Content-Type':string} => {
    const token = JSON.parse(localStorage.getItem('jwt') as string);
    return (
      {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      }
    )
  }