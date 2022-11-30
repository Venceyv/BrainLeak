import React, { useEffect, useState } from 'react'

function Header() {


  // const [headerAPI, setHeaderAPI] = useState([]); 
  // const [name, setName] = useState([]);

  // const fetchHeader = () => {
  //   fetch("https://jsonplaceholder.typicode.com/photos?id=1").then(response => response.json()).then((json) => setHeaderAPI(json));
  // }

  // const fetchName = () => {
  //   fetch("https://jsonplaceholder.typicode.com/users").then(response => response.json()).then((json) => setName(json));
  // }

  // useEffect(() => {
  //   fetchHeader();
  //   fetchName();
  // })

  
  return (
    //Profile Parent Container
    //SET BANNER TO FIXED SIZE
      <div className="bg-slate-700	 h-[210px] rounded-b-lg flex">
        {/* <img className="border-2 border-black h-[210px] w-full rounded-b-lg flex flex-row" src={headerAPI[0]?.url}></img> */}
          <div className="mb-2 flex items-center mt-auto overflow-auto text-black	pt-2">
          
          {/* Container for Image */}
            <div className="ml-2 float-left p-1">
              {/* User Icon placeholder */}
                <img className='h-auto w-[105px] p-0.5'
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Avatar"></img>
    
            </div>
            <div className='text-left p-2 leading-5'>
                {/* UserName placeholder, need to add react imports (from API) */}
                <div className='font-bold'>
                  {/* {name[0]?.name} */}
                  Name Place Holder
                </div>
    
                {/* Link placeholder to send to profile page for editing */}
    
                <div className=''>
                <a href="./">Edit your Profile</a>
                </div>
            </div>
          </div>
      </div>
  )
}

export default Header