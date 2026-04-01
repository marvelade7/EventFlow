import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import '/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
      </Routes>
    </>
  )
}

export default App