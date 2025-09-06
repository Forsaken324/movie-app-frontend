import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyShowsData, dummyDateTimeData } from '../assets/assets';
import MovieBanner from '../components/MovieBanner';
import MovieCast from '../components/MovieCast';
import DateSelect from '../components/DateSelect';
import Recommendations from '../components/Recommendations';
import LoadingAnimation from '../components/animations/LoadingAnimation';
import axios from 'axios';
import toast from 'react-hot-toast';

const MovieDetails = () => {

  const { id } = useParams();
  // const params = useParams();
  // const [movie, setMovie] = useState(null);
  const [show, setShow] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const getShow = async () => {
    const show = await axios.get(BACKEND_URL + `/shows/${id}`)
        .then(response => {
          if(response.status == 200)
          {
            return response.data
          }
          else
          {
            return toast.error('An error occured, try again later');
          }
        })
        .catch(error => {
          console.error('Error: ', error);
        })
    
    const showAiringDates = await axios.get(BACKEND_URL + `/shows/${id}/time`)
        .then(response => {
          if(response.status == 200)
          {
            return response.data
          }
          else
          {
            return toast.error('An error occured, try again later');
          }
        })
        .catch(error => {
          console.error('Error: ', error);
        })

    if (show) {
      setShow({ movie: show, dateTime: showAiringDates })
    }

  }

  useEffect(() => {
    getShow()
  }, [id])

  // useEffect(() => {

  //   const movieFiltered = dummyShowsData.filter((movie) => movie._id === id);
  //   setMovie(movieFiltered[0]);

  // }, [id])

  return (
    <div>
      {show ? (
        <>
          <MovieBanner movie={show.movie} />
          <MovieCast casts={show.movie.casts} />
          <DateSelect dateTime={show.dateTime} id={id} />
          <Recommendations shows={dummyShowsData} id={id} />
        </>
      ) : (
        <div className='flex flex-col items-center justify-center mt-70'>
          <LoadingAnimation />
        </div>
      )}
    </div>
  )
}

export default MovieDetails;