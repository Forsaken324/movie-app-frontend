import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BlurCircle from './BlurCircle';
import MovieCard from './MovieCard';
import { useEffect } from 'react';
import axios from 'axios';
import LoadingAnimation from './animations/LoadingAnimation';

const FeaturedSection = () => {
    const navigate = useNavigate();
    const [shows, setShows] = useState(null);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const getShows = async () => {
        await axios.get(BACKEND_URL + '/shows/')
        .then(response => {
            if (response.status == 200)
            {
                setShows(response.data);
                return;
            }
        })
        .catch(error => {
            console.error('Error: ', error);
        })
    }

    useEffect(() => {
        getShows();
    }, []);
    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden'>
            <div className='relative flex items-center justify-between pt-20 pb-10'>
                <BlurCircle className={'top-0 right-[-80px]'} />
                <p className='text-gray-300 font-medium text-lg'>Now Showing</p>
                <button onClick={() => {navigate('/movies'); scrollTo(0,0)}} className='group flex items-center gap-2 text-sm text-gray-300 cursor-pointer'>
                    View All 
                    <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5' />
                </button>
            </div>
            <div className='flex flex-wrap justify-evenly items-center max-sm:justify-center gap-8 mt-8'>
                {
                    shows ? (
                        shows.slice(0,4).map((show, index) => (
                            <MovieCard key={index} movie={show}/>
                        ))
                    ) : <LoadingAnimation />
                }
            </div>
            <div className='flex items-center justify-center pt-20'>
                <button onClick={() => {navigate('/movies'); scrollTo(0,0)}} className='bg-primary px-8 py-2 rounded-lg hover:bg-primary-dull duration-300 ease-in font-medium cursor-pointer'>Show more</button>
            </div>
        </div>
    )
}

export default FeaturedSection