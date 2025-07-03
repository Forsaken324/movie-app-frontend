import React from 'react'
import { dummyShowsData } from '../assets/assets'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'


const Movies = () => {
  return dummyShowsData.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle className={'top-[100px] left-0'} />
      <BlurCircle className={'bottom-[50px] right-[50px]'} />
      <h1 className='text-lg font-medium my-4'>Now Showing</h1>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {dummyShowsData.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className='flex items-center justify-center'>
      <div className='flex items-center justify-center p-10 w-[70%] border border-gray-300 rounded-lg mt-[200px]'><h2 className='text-xl font-bold text-center text-gray-300'>No movies are currently available</h2></div>
    </div>
  )
}

export default Movies;