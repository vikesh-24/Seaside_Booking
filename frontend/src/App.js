import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import BookingForm from './components/BookingForm';
import BookingsPage from './components/BookingPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Register/>}/>
        <Route path='/book-adventure' element={<BookingForm/>}/>
        <Route path="/my-bookings" element={<BookingsPage />} />
      </Routes>
      
    </div>
  );
}

export default App;
