import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const linkStyle = {
    textDecoration: 'none',
    color: 'black'
  };

  const buttonStyle = {
    color: 'black'
  };

  return (
    <nav className="navbar navbar-light bg-light px-4">
      <span className="navbar-brand mb-0 h1">🏡 PropMall</span>
      <div>
        <Link to="/" className="btn btn-link" style={linkStyle}>Home</Link>
        <button className="btn btn-link" style={buttonStyle}>For Sale</button>
        <button className="btn btn-link" style={buttonStyle}>For Rent</button>
      </div>
    </nav>
  );
};

export default Header;
