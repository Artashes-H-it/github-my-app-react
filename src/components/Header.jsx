import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import  logout  from './../utils/logout';
import { Button } from './ui';

const Header = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

 
     useEffect(() => {
         const token = localStorage.getItem('token');
         if(token){
           setIsAuthenticated(true);
         }
     }, [])

    return (
       <nav>
         <Link to="/">Home</Link>
         <Link to="/about">About</Link>
         {isAuthenticated && <Link to="/profile">Profile</Link>}
         {!isAuthenticated ? <Link to="/login">Login</Link> : <Button onClick={() => logout()}>Logout</Button>}
         {!isAuthenticated &&  <Link to="/register">Register</Link>}
       </nav>
    );
}

export default Header;