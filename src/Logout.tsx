import React, { useEffect } from 'react';
import { logout } from './spotifyLogin';
import { Navigate, Router, redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Logout: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        logout()
        navigate("/")
     }, [navigate]); // 

return (
    < div></div>
);

};

export default Logout;