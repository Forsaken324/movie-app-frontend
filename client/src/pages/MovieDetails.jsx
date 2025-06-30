import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyShowsData } from '../assets/assets';
import { StarIcon } from 'lucide-react';
import { timeFormat } from '../lib/timeFormat';

const MovieDetails = () => {

  const params = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {

    const id = params.id;
    const movieFiltered = dummyShowsData.filter((movie) => movie._id == id);
    setMovie(movieFiltered[0]);

  }, [])

  return (
    <div>
      {movie ? (
        <div>
          <div className='w-[278px] h-[417px] bg-teal-900 rounded-xl'>
            <img src={movie.backdrop_path} alt="ss" className='rounded-lg h-full w-full object-cover cursor-pointer' />
          </div>
          <div>
            <p>ENGLISH</p>
            {console.log(movie)}
            <h2>{movie.title}</h2>
            <span><StarIcon className='w-4 h-4 text-primary fill-primary'/> {movie.vote_average.toFixed(1)} IMDb Rating</span>
          </div>
          <div>
            <p>{movie.overview}</p>
            <span className=''>{timeFormat(movie.runtime)} . {movie.genres.slice(0,2).map((genre) => genre.name).join(' | ')} . {new Date(movie.release_date).getDay()}</span>
          </div>
        </div>
      ): ''}
    </div>
  )
}

export default MovieDetails;