import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../assets/assets';
import BookedCard from '../components/BookedCard';
import BlurCircle from '../components/BlurCircle';
import LoadingAnimation from '../components/animations/LoadingAnimation';

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    setBookings(dummyBookingData);
    setIsLoading(false);
  }

  useEffect(() => {
    getMyBookings();
  }, [])

  return !isLoading ? (
    <div className='mt-[50px] p-30'>
      <h2 className='font-bold text-[20px]'>My Bookings</h2>
      <div>
        <BlurCircle className='left-[300px]' />
        {bookings.map((movie, index) => (
          <BookedCard key={index} booking={movie}/>
        ))}
      </div>
    </div>
  ) : <div className='flex items-center justify-center mt-50'><LoadingAnimation /></div>
} 

export default MyBookings