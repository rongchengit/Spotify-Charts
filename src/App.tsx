import { useEffect} from 'react'; //{} only grabs useEffect and useState from react
import * as React from "react";
import './App.css';
import {Route, Routes } from 'react-router-dom';
import Home from './Home';
import Callback from './Callback';


interface OptionType{ //this is for drop down interface
  value: string;
  label: string;
}

function App() {

  useEffect(() => {
  }, []);
//adding the input field and save it to the variable userID and when changing it call the function handleuserid
return (
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/callback" element={<Callback/>} />
        {/* Add more routes for other components as needed */}
      </Routes>

);
}

export default App;