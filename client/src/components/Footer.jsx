import React from 'react'
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const date = new Date();
const year = date.getFullYear();
const Footer = () => {
  return (
    <footer className='mt-[300px]'>
      <div className='flex flex-col md:flex-row text-gray-300 justify-evenly'>
        {/* quick show logo, brief and store buttons */}
        <div className='flex flex-col p-5 gap-7 w-auto md:w-[500px] items-start'>
          <img src={assets.logo} alt="quick show logo" className='h-[30px]' />
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis voluptatibus incidunt labore aspernatur, quisquam atque assumenda similique suscipit facere quam optio vero eum earum, ipsam ratione omnis eveniet voluptas velit.</p>
          <div className='flex gap-3'>
            <Link to='/'><img src={assets.googlePlay} alt="google play logo" /></Link>
            <Link to='/'><img src={assets.appStore} alt="app store logo" /></Link>
          </div>
        </div>
        {/* company section */}
        <div className='flex flex-col gap-7 mt-3 ml-9 md:ml-0'>
          <p>Company</p>
          <div className='flex flex-col gap-2'>
            <Link to={'/'}>Home</Link>
            <Link to={'/about-us'}>About us</Link>
            <Link to={'/contact-us'}>Contact us</Link>
            <Link to={'/privacy-policy'}>Privacy policy</Link>
          </div>
        </div>
        {/* get in touch */}
        <div className='flex flex-col gap-5 mt-10 md:mt-3 ml-9 md:ml-0'>
          <p>Get in touch</p>
          <div>
            <p>+234 91 435 219 33</p>
            <p>contact@example.com</p>
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center mt-10'>
        <div className='border-gray-600 border-t-1 text-gray-300 w-[80%] text-center p-9'>
          <p>Copyright {year} &copy; React Lessons. All Right Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer