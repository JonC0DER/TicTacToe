import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <p>Original Project by
        <a href="http://" target="_blank" rel="noopener noreferrer">a link to...</a>
         and 
        <a href="http://" target="_blank" rel="noopener noreferrer">a link to...</a>
      </p>
      <p>
        Refactor by 
        <a href="http://" className='turquoise'>@person</a>
      </p>
    </footer>
  )
}

export default Footer