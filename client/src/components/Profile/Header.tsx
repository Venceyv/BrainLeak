import React, { useState } from 'react'

function Header({follower, following}) {

  return (
    //Profile Parent Container
    <div className="border-2 rounded-lg h-1/10 w-3/5 flex items-center mt-5 translate-x-1/3 overflow-auto p-1 bg-neutral-800 text-white	">
      {/* Container for Image */}
        <div className="float-left p-1">
          {/* User Icon placeholder */}
            <img className='h-auto w-14 p-0.5'
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Avatar"></img>
  
        </div>
        <div className='text-left p-2 leading-5'>
            {/* UserName placeholder, need to add react imports (from API) */}
            <div className='font-bold'>
              UserName
            </div>

            {/* Link placeholder to send to profile page for editing */}

            <div className=''>
            <a href="./">Edit your Profile</a>
            </div>
        </div>
        <div className='text-center p-1 ml-auto mr-0'>
              <div>
                {follower}
              </div>
              <div>
                Followers
              </div>
        </div>
        <div className='text-center p-2.5'>
              <div>
                {following}
              </div>
              <div>
                Following
              </div>
        </div>
    </div>
  )
}

export default Header