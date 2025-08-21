import { Navigate, Outlet } from 'react-router-dom';

const hasToken = () => !!localStorage.getItem("token");

const GuestRoute = () => {
  if (hasToken()) {
    return <Navigate to="/" replace />;
  }
  return <Outlet/>;
};

export default GuestRoute;