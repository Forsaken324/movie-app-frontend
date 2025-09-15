import React, { useEffect, useState } from 'react'
import BookedCard from '../components/BookedCard';
import BlurCircle from '../components/BlurCircle';
import LoadingAnimation from '../components/animations/LoadingAnimation';
import axios from 'axios';
import { lookInSession } from '../common/session';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';

const MyBookings = () => {

  const [bookings, setBookings] = useState(null);

  const navigate = useNavigate;

  const { setShowAuthScreen } = useAuth();
  const [searchParams] = useSearchParams();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const getMyBookings = async () => {
    const authToken = lookInSession('quick_token');

    if(!authToken)
    {
      toast.error('You need to be logged in to check your bookings')
      setShowAuthScreen(true);
      document.body.style.overflow = 'hidden';
      return;
    }

    const trxref = searchParams.get('trxref');

    const reference = searchParams.get('reference');

    let url = BACKEND_URL + '/user/my-bookings'

    if (trxref && reference)
    {
      url = BACKEND_URL + `/user/my-bookings?trxref=${trxref}&reference=${reference}`
    }

    await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
        .then(response => {
          if (response.status == 200)
          {
            setBookings(response.data['bookings']);
            const responsePaymentMessage = response.data['payment_message'];
            if (responsePaymentMessage !== '')
            {
              toast(responsePaymentMessage);
              return
            }
            return;
          }
          else
          {
            toast.error('Sorry an error occured, try again later');
            navigate('/');
          }
        })
        .catch(error => {
          if (error.status == 403)
          {
            scrollTo(0,0);
            document.body.style.overflow = 'hidden';
            toast.error('Sorry an error occurred, you need to sign in again')
            setShowAuthScreen(true)
            return;
          }
          console.log('Error: ', error);
          return;
        })
  }

  useEffect(() => {
    getMyBookings();
  }, [])

  return bookings ? (
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