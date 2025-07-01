import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyShowsData } from '../assets/assets';
import { StarIcon } from 'lucide-react';
import { timeFormat } from '../lib/timeFormat';
import MovieBanner from '../components/MovieBanner';
import MovieCast from '../components/MovieCast';

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
        <>
          <MovieBanner movie={movie} />
          <MovieCast casts={movie.casts} />
        </>
      ) : ''}
    </div>
  )
}

export default MovieDetails;