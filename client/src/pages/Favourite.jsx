import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../assets/assets'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'
import axios from 'axios'
import { lookInSession } from '../common/session'
import { useAuth } from '../hooks/useAuth'

const Favourite = () => {
  const [favourites, setFavourites] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { setShowAuthScreen } = useAuth();
  const getFavourites = async () => {
    const token = lookInSession('quick_token');
    await axios.get(BACKEND_URL + '/user/favourite-shows', {
      headers: {
        'Authorization': `Bearer: ${token}`
      }
    })
    .then(response => {
      if (response.status == 200)
      {
        setFavourites(response.data);
      }
    })
    .catch(error => {
      if (error.status == 403 || 401)
      {
        scrollTo(0,0);
        document.body.style.overflow = 'hidden';
        setShowAuthScreen(true);
        return toast.error('Sorry, you need to be logged in first');
      }
    })
  }
  useEffect(() => {
    getFavourites();
  })
  return favourites ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle top='150px' left='0' />
      <BlurCircle bottom='50px' right='50' />
      <h1 className='text-lg font-medium my-4'>Your Favourite Movies</h1>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {dummyShowsData.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className='flex items-center justify-center'>
      <div className='flex items-center justify-center p-10 w-[70%] border border-gray-300 rounded-lg mt-[200px]'><h2 className='text-xl font-bold text-center text-gray-300'>No Favourite are currently available</h2></div>
    </div>
  )
}

export default Favourite;