import { useState } from 'react'
import MovieCastModal from './modals/MovieCastModal';

const MovieCast = ({ casts }) => {
    const initialCasts = casts.slice(0, 7);
    const [showCastModal, setShowCastModal] = useState(false);

    

    return (
        <div className='flex flex-col items-center pt-20 pb-20 pl-7 md:pl-12'>
            {showCastModal ? <MovieCastModal casts={casts} setShowCastModal={setShowCastModal}  /> : (
                <div>
                    <h2 className='pb-[50px] pt-[40px]'>Your Favourite Cast</h2>
                    <div className='flex flex-wrap gap-7'>
                        {initialCasts.map((cast) => (
                            <div key={cast.name} className='flex flex-col items-center'>
                                <div className='h-[101.94px] w-[101.94px] rounded-full overflow-hidden'>
                                    <img src={cast.profile_path} alt={cast.name} className='w-full h-full object-cover cursor-pointer' />
                                </div>
                                <p>{cast.name}</p>
                                <p className='text-sm text-gray-400'>Peter Quil</p>
                            </div>
                        ))}
                    </div>
                    <div className='text-center p-10 text-gray-400 cursor-pointer' onClick={() => setShowCastModal(true)}>view all</div>
                </div>)}
        </div>
    )
}

export default MovieCast;