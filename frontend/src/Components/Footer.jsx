import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className='content'>
        <p>&copy; {new Date().getFullYear()} TEAM. All Rights Reserved.</p>
        <p>Message us at team@gmail.com.</p>
      </div>
    </footer>
  );
};

export default Footer;
