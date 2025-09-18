import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import  logout  from './../utils/logout';
import {isAuthenticatedFunc} from '../utils/utils';
import { Button } from './ui';

const Header = () => {

    return (
       <nav>
         <Link to="/">Home</Link>
         <Link to="/about">About</Link>
         {isAuthenticatedFunc() && <Link to="/profile">Profile</Link>}
         {!isAuthenticatedFunc() ? <Link to="/login">Login</Link> : <Button onClick={() => logout()}>Logout</Button>}
         {!isAuthenticatedFunc() &&  <Link to="/register">Register</Link>}
       </nav>
    );
}

export default Header;