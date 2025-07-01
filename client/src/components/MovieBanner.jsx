import { HeartIcon, StarIcon } from 'lucide-react';
import { timeFormat } from '../lib/timeFormat';
import BlurCircle from './BlurCircle';
import { Dot } from 'lucide-react';

const MovieBanner = ({ movie }) => {
    const date = new Date(movie.release_date);
    const formattedDate = `${date.getDate()}, ${date.toLocaleString('en-GB', {
        month: 'long',
        year: 'numeric',
    })}`
    return (
        <div className='mt-[180px]'>
            <BlurCircle className="left-[200px] top-30 md:left-[650px] md:top-[50px]" />
            <div className='flex flex-col md:flex-row justify-center w-full p-5'>
                <div className='w-[90%] md:w-[278px] h-[417px] ml-[25px] md:ml-0 bg-teal-900 rounded-xl'>
                    <img src={movie.backdrop_path} alt="ss" className='rounded-lg h-full w-full object-cover cursor-pointer' />
                </div>
                <div className='pl-0 md:pl-10 w-auto md:w-[600px] '>
                    <div className='mt-10 mb-6'>
                        {/* {movie.original_language} */}
                        <p className='font-semibold text-xl text-primary'>English</p>
                        {console.log(movie)}
                        <h2 className='text-[36px] font-bold'>{movie.title}</h2>
                        <span className='flex items-center gap-3'><StarIcon className='w-4 h-4 text-primary fill-primary' /> {movie.vote_average.toFixed(1)} IMDb Rating</span>
                    </div>
                    <div>
                        <p className='text-gray-400 mb-5'>{movie.overview}</p>
                        <span className='flex text-gray-300'>{timeFormat(movie.runtime)} <Dot /> {movie.genres.slice(0, 2).map((genre) => genre.name).join(' | ')} <Dot /> {formattedDate}</span>
                    </div>
                    <div className='flex gap-5 mt-8'>
                        <button className='bg-blueish-gray h-[44px] w-[161px] hover:bg-light-blueish-gray transition duration-300 rounded-lg'>Watch Trailer</button>
                        <button className='bg-primary h-[44px] w-[135px] rounded-lg hover:bg-primary-dull transition duration-300'>Buy Tickets</button>
                        <button className='flex justify-center items-center h-[41px] w-[41px] bg-light-blueish-gray rounded-full hover:bg-blueish-gray transition duration-300'><HeartIcon /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieBanner