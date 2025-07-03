import React from 'react'
import { useNavigate } from 'react-router-dom';

import { ArrowRight } from 'lucide-react';

import MovieCard from './MovieCard';
import BlurCircle from './BlurCircle';

const Recommendations = ({ shows, id }) => {
    const filteredShow = shows.filter((show) => show._id !== id);
    const recommended = filteredShow.slice(0, 4);
    const navigate = useNavigate();

    return (
        <div className='flex items-center justify-center p-10 mt-60'>
            <div className=''>
                <div className='relative flex items-center justify-between pt-20 pb-10'>
                    <BlurCircle className={'top-0 left-[-40px] md:left-[-80px]'} />
                    <p className='text-gray-300 font-medium text-lg'>Now Showing</p>
                    <button onClick={() => navigate('/movies')} className='group flex items-center gap-2 text-sm text-gray-300 cursor-pointer'>
                        View All
                        <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5' />
                    </button>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5'>
                    {recommended.map((show) => (
                        <MovieCard movie={show} key={show._id} />
                    ))}
                </div>
                <div className='flex items-center justify-center pt-20'>
                    <button onClick={() => { navigate('/movies'); scrollTo(0, 0) }} className='bg-primary px-8 py-2 rounded-lg hover:bg-primary-dull duration-300 ease-in font-medium cursor-pointer'>Show more</button>
                </div>
            </div>
        </div>
    )
}

export default Recommendations;