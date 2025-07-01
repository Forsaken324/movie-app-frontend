import React, { useEffect, useState } from 'react'

const MovieCast = ({ casts }) => {

    const [castBatch, setCastBatch] = useState([]);
    const length = casts.length - 1;

    let start = 0;
    let end = 7;

    const nextBatch = () => {
        start = end > 0 ? end : start;
        end = start * 7;

        if (end === length || end > length)
        {
            end = 0;
            return
        }
    }
    const previousBatch = () => {
        end = end - start;
        start = start / 2;
    }

    const changeCasts = (instruction) => {
        if (instruction == 'next')
        {
            start = end;
            end = start * 2;

            if (end === length)
            {
                end = 0;
                return;
            }

        }
        else
        {

        }
    }

    useEffect(() => {
        const data = casts.slice(20, 40);
        console.log(data);
        setCastBatch(data);


    }, [start, end])
    return (
        <div className=''>
            <h2 >Your Favourite Cast</h2>
            <div className='flex gap-15 w-[850px]  '>
                <button onClick={previousBatch} className='bg-green-900'>previous</button>
                {castBatch.map((cast) => (
                    <div key={cast.name}>
                        <div className='h-[101.94px] w-[101.94px] rounded-full overflow-hidden'>
                            <img src={cast.profile_path} alt={cast.name} className='w-full h-full object-cover cursor-pointer' />
                        </div>
                        <p>{cast.name}</p>
                        <p>Peter Quil</p>
                    </div>
                ))}
                <button onClick={nextBatch} className='bg-green-700'>next</button>
            </div>
        </div>
    )
}

export default MovieCast;