import React from 'react';
import loadingGif from '../assets/images/loadingGif-unscreen.gif'; // Adjust the path if necessary

const Loader = () => {
  return (
    <img 
      src={loadingGif} 
      style={{ width: '40px', height: '40px' }} // Set size to look like an icon
    />
  );
};

export default Loader;
