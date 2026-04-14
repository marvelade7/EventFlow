import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import UserDashboard from './pages/UserDashboard';
import CreateNewEventPage from './pages/CreateNewEventPage';
import Error404 from './pages/Error404';
import AdminAuthPage from './pages/AdminAuthPage';
import CheckoutPage from './pages/CheckoutPage';

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/signin' element={<SignIn/>} />
        <Route path='/dashboard' element={<UserDashboard/>} />
        <Route path='/create-event' element={<CreateNewEventPage />} />
        <Route path='/admin-auth' element={<AdminAuthPage />} />
        <Route path='/checkout' element={<CheckoutPage />} />
        <Route path='*' element={<Error404/>} />
      </Routes>
    </>
  )
}

export default App