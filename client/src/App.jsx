import React from 'react'
import "./index.css"

import { Routes, Route, useLocation } from 'react-router-dom'

import NavBar from './components/NavBar'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MoviesDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favourite from './pages/Favourite'
import Footer from './components/Footer'

import { Toaster } from 'react-hot-toast'
import Layout from './pages/admin/Layout'
import DashBoard from './pages/admin/Dashboard'
import AddShows from './pages/admin/AddShows'
import ListShows from './pages/admin/ListShows'
import ListBookings from './pages/admin/ListBookings'

import { useAuth } from './hooks/useAuth'
import LoginXSignup from './components/LoginXAuth'

const App = () => {

  const isAdminRoute = useLocation().pathname.startsWith('/admin');
  const {showAuthScreen} = useAuth();

  return (
    <>
    {/* in order to be able to use the toast notification in any component, we must add the toaster component here or in our main.tsx */}
      <Toaster /> 
      {!isAdminRoute && <NavBar />}
      {
        showAuthScreen ? <LoginXSignup mode={'login'}/> : ''
      }
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MoviesDetails />} />
        <Route path='/movies/:id/:date' element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/favourite' element={<Favourite />} />
        <Route path='/admin/*' element={<Layout />}>
          <Route index element={<DashBoard />} />
          <Route path='add-shows' element={<AddShows />} />
          <Route path='list-shows' element={<ListShows />} />
          <Route path='list-bookings' element={<ListBookings />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
    )
}

export default App;