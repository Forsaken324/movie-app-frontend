import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyShowsData, dummyDateTimeData } from '../assets/assets';
import MovieBanner from '../components/MovieBanner';
import MovieCast from '../components/MovieCast';

const MovieDetails = () => {

  const { id } = useParams();
  const params = useParams();
  const [movie, setMovie] = useState(null);
  const [show, setShow] = useState(null);
  
  const getShow = async () => {
    const show = dummyShowsData.find((show) => show._id === id);
    setShow({movie: show, dateTime: dummyDateTimeData})
  }

  // useEffect(() => {
  //   getShow()
  // }, [id])

  useEffect(() => {

    const movieFiltered = dummyShowsData.filter((movie) => movie._id === id);
    setMovie(movieFiltered[0]);

  }, [id])

  return (
    <div>
      {movie ? (
        <>
          <MovieBanner movie={movie} />
          <MovieCast casts={movie.casts} />
        </>
      ) : ( 
        <div className='flex flex-col items-center justify-center h-screen'>
          <h1 className='text-3xl font-bold text-center'>Loading...</h1>
        </div>
       )}
    </div>
  )
}

export default MovieDetails;