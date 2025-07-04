import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyDateTimeData, dummyShowsData } from '../assets/assets';
import LoadingAnimation from '../components/animations/LoadingAnimation';
import { ClockIcon } from 'lucide-react';
import isoTimeFormat from '../lib/isoTimeFormat';
import BlurCircle from '../components/BlurCircle';

const SeatLayout = () => {

  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);

  const navigate = useNavigate();

  const getShow = async () => {
    const show = dummyShowsData.find((show) => show._id == id);
    if (show) {
      setShow({
        movie: show,
        dateTime: dummyDateTimeData
      });
    }
  }

  const renderSeats = (row, count = 9) => {

  }

  useEffect(() => {
    getShow();
  }, [id])

  return show ? (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50'>
      {/* Available Timings */}
      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div>
          {show.dateTime[date].map((item, index) => (
            <div key={item.time} className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition  ${selectedTime?.time === item.time ? 'bg-primary text-white' : 'hover:bg-primary/20'}`} onClick={() => setSelectedTime(item)}>
              <ClockIcon className='w-4 h-4' />
              <p className='text-sm'>{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Seats Layout */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <BlurCircle className={'top-[-100px] left-[-100px]'} />
        <BlurCircle className={'bottom-0 right-0'} />
        <h1 className='text-2xl font-semibild mb-4'>Select your seat</h1>
        <img src={assets.screenImage} alt='screen image' />
        <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>
      </div>
    </div>
  ) : (
    <div className='flex items-center justify-center mt-50'><LoadingAnimation /></div>
  )
}

export default SeatLayout