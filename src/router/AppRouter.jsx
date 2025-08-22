import React, { useEffect, useState } from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import About from '../pages/About';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import PrivateRoute from '../components/hoc/PrivateRoute';
import GuestRoute from '../components/hoc/GuestRoute';
import Profile from '../pages/Profile';
import EmailVerify from './../pages/EmailVerify';
import EmailResendVerify from '../pages/EmailResendVerify';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import AuthCallback from '../pages/auth/AuthCallback';


const AppRouter = () => {

 const [isVerified, setIsVerified] = useState(false);


useEffect(() => {
    const token = localStorage.getItem('token');
    const verified = localStorage.getItem('verified');
    if(token){
      setIsAuthenticated(true);
    }
    
    if(verified == 'true') {
      setIsVerified(true);
    }
console.log('dsaf44');
}, []);

// async function handleResendVerification() {
//   try {
//     await api.post("/api/resend-verification");
//   } catch (error) {
//     console.error("Error resending verification:", error);
//   }
// }

  //  if (loading) return <p>Загрузка...</p>;

   return (
    <Routes>
      <Route path='/' element={<MainLayout/>}>
         <Route index path="/" element={<Home />} />
         <Route path="/about" element={<About />} />
      </Route>
      
      <Route
          element={
            <GuestRoute>
              <Outlet />
            </GuestRoute>
          }
        >
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Public but requires login to check verification */}
      {!isVerified && <Route path="/email-verify-resend" element={<EmailResendVerify />} />}
      <Route path="/email-verify" element={<EmailVerify />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<NotFound/>} />
    </Routes>
   )
}

export default AppRouter;