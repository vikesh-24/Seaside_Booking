import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import BookingForm from './components/BookingForm';
import BookingsPage from './components/BookingPage';
import AddStaff from './components/AddStaff';
import EditStaff from './components/EditStaff';
import ApplyLeave from './components/ApplyLeave';
import AdminLeaveRequests from './components/AdminLeaveRequests';
import AdminDashboard from './pages/AdminDashboard';
import Addpackage from './components/Addpackage';
import PackageList from './components/Packagelist';
import EditPackage from './components/Editpackage'; 
import AddTransaction from './components/AddTransaction';
import TransactionList from './components/Transactionlist';
import EditTransaction from './components/EditTransaction';
import Home from './pages/Homepage';
import BookingAnalysis from './components/BookingAnalysis';
import StaffList from './components/StaffList';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Register/>}/>
        <Route path='/book-adventure' element={<BookingForm/>}/>
        <Route path="/my-bookings" element={<BookingsPage />} />
        <Route path='/addstaff' element={<AddStaff/>}/>
      <Route path="/edit-staff/:id" element={<EditStaff/>} />
      <Route path="/apply-leave" element={<ApplyLeave />} />
      <Route path="/admin/leave-requests" element={<AdminLeaveRequests />} />
      <Route path='/admin-dashboard' element={<AdminDashboard />} />
        <Route path='/add' element={<Addpackage />} />
        <Route path='/packages' element={<PackageList />} />
        <Route path='/edit/:id' element={<EditPackage/>}/>
        <Route path='addTransaction' element={<AddTransaction/>}/>
        <Route path='transactionList' element={<TransactionList/>}/>
        <Route path='/editTransaction/:id' element={<EditTransaction/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/book/analysis' element={<BookingAnalysis/>}/>
        <Route path='/staff-list' element={<StaffList/>}/>
      </Routes>
      
    </div>
  );
}

export default App;
