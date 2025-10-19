import { StarIcon } from "lucide-react"
import { useNavigate } from "react-router-dom";

import { timeFormat } from "../lib/timeFormat";

const MovieCard = ({movie}) => {
    const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-evenly p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66">
        {/* <div className="p-10 h-[170px] w-[270px] rounded flex items-center justify-center" ref={imageContainer}>
        </div> */}
        <img onClick={() => {navigate(`/movies/${movie.id}`); scrollTo(0,0)}} src={movie.backdrop_path} alt="" className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer" />
        <p className="font-semibold mt-2 truncate">{movie.title}</p>
        <p className="text-sm text-gray-400 mt-2">
            {new Date(movie.release_date).getFullYear()} . {movie.genres.slice(0,2).map(genre => genre.name).join(" | ")} . {timeFormat(movie.runtime)}
        </p>
        {/* <div className="p-4 space-y-2">
            <h2 className="text-xl font-semibold">Alita Battle Angel 4k 2019 Movies</h2>
            <span className="text-md text-gray-300">2018 - Action, Adventure - 2h 8m</span>
        </div> */}
        <div className="flex items-center justify-between mt-4 pb-3">
            <button onClick={() => {navigate(`/movies/${movie.id}`); scrollTo(0,0)}} className="px-5 py-2.5 text-xs bg-primary hover:bg-primary-dull transition duration-300 ease-in font-medium  rounded-lg cursor-pointer">Buy Ticket</button>
            <span className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1"><StarIcon className="w-4 h-4 text-primary fill-primary"/> {movie.vote_average.toFixed(1)}</span>
        </div>
    </div>
  )
}

export default MovieCard