import React from 'react'; // Add this import
import { useState } from 'react';
import './App.css';
import Homepage from './Components/Common/Homepage';
import Approutes from './Routes/MainRoutes';

const App:React.FC = () =>{
  return (
    <>
      <Approutes/>
    </>
  );
}

export default App;
