import React, { useEffect } from 'react';
import { getAccessToken } from './spotifyLogin';
import { Navigate, Router, redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Callback: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
  getAccessToken()
    .then(()=>{
        navigate("/")
    })
  }, [navigate]); // 

return (
  <div></div>
);
};

export default Callback;