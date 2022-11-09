import React, { useState } from 'react'

function Header(/*{follower, following}*/) {

  return (
    //Profile Parent Container
    <div className="h-1/3">
      <div className="flex flex-row pb-3 bg-teal-900  rounded-b-lg h-full">
      </div>
      <div className="flex items-center mt-auto overflow-auto text-black	pt-2">
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
        {/*<div className='text-center p-1 ml-auto mr-0'>
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
        </div>*/}
    </div>
  </div>
  )
}

export default Header