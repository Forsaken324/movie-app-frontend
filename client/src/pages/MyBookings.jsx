import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../assets/assets';
import BookedCard from '../components/BookedCard';
import BlurCircle from '../components/BlurCircle';
import LoadingAnimation from '../components/animations/LoadingAnimation';

const MyBookings = () => {

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
    <div className='md:mt-[50px] md:pt-30 md:pl-10 lg:p-30'>
      <BlurCircle className='top-[100px] left-0 md:left-[100px]'/>
      <div className='w-full'>
        <BlurCircle className='bottom-0 md:left-[600px]'/>
      </div>
      <h2 className='font-bold text-[20px] pb-10 mt-30 ml-5 sm:ml-5 sm:mt-0'>My Bookings</h2>
      <div className='pl-5 md:p-0'>
        {bookings.map((movie, index) => (
          <BookedCard key={index} booking={movie}/>
        ))}
      </div>
    </div>
  ) : <div className='flex items-center justify-center mt-50'><LoadingAnimation /></div>
} 

export default MyBookings