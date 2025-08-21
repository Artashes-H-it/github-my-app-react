import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from "react-router-dom"

const hasToken = () => !!localStorage.getItem("token");
const isVerified = () => localStorage.getItem("verified") === "true";

const PrivateRoute = ({ children }) => {
  if (!hasToken()) {
    return <Navigate to="/login" replace />;
  }
  if (!isVerified()) {
    return <Navigate to="/email-verify-resend" replace />;
  }
  return children;
};

export default PrivateRoute;