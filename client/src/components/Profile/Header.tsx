import { useEffect, useState } from 'react'
import axios from 'axios'

function Header() {


    //Fetching data using axios
    const [photos, setPhotos] = useState([])
  
    const fetchData = () => {
      axios.get("https://jsonplaceholder.typicode.com/photos").then(response => {
        setPhotos(response.data)
      })
    }
  
    useEffect(() => {
      fetchData()
    }, [])


    //Tried Using React Query way but got Error: No QueryClient set, use QueryClientProvider to set one and couldnt find fix.

    // const { data, error, isError, isLoading } = useQuery('photos', fetchPhoto)
    // if (isLoading) {
    //   return <div>Loading...</div>
    // }
    // if (isError) {
    //     return <div>Error! {error.message}</div>
    // }
  
  
  return (
    //Profile Parent Container
      <div className= "bg-slate-700 relative h-[210px] rounded-b-lg flex max-w-[1920px] m-auto">
        <img className="border-2 border-black w-full h-[210px] rounded-b-lg flex flex-row" src={photos[0]?.url}></img>
        {/* <img className="border-2 border-black w-full h-[210px] rounded-b-lg flex flex-row" src={data[0]?.url}></img> */}
          <div className="top-1/3 absolute mb-2 flex items-center mt-auto overflow-auto text-black	pt-2">
          
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