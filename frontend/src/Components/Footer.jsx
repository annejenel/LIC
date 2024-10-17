import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'transparent',
      padding: '10px',
      textAlign: 'center',
      fontSize: '12px',
      borderTop: '2px dashed #89343b',
      color: 'rgb(31, 30, 30)',
      fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
      fontWeight: 50,
      position: 'relative',
      bottom: 0,
      width: '100%',
      left: 0,
      marginTop: '18.5vh'
    }}>
      <div className='content'>
        <p>&copy; {new Date().getFullYear()} TEAM. All Rights Reserved.</p>
        <p>Message us at team@gmail.com.</p>
      </div>
    </footer>
  );
};

export default Footer;
