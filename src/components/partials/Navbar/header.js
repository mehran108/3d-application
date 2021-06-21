import React from 'react';
import {Link} from 'react-router-dom';
import './header.css';
import DrawerToggleButton from '../SideDrawer/DrawerToggleButton';

const Header = props =>{
  return (
    <header className="navbar">
      <nav className="navbar-navigation">
        <div className="navbar-toggle-button">
          <DrawerToggleButton click={props.drawerToggleHandler}/>
        </div>
        <div className="navbar-logo">
          <Link className='navbar-logo' to="/">DevsFort</Link>
        </div>
        <div className="navbar-spacer"></div>
        <div className="navbar-items">
        <ul>
          <Link className="nav-links" to="/"><li>Home</li></Link>
          <Link className="nav-links" to="/chair">  <li>Chair</li> </Link>
          <Link className="nav-links" to="/sophie">  <li>Sophie</li> </Link>
          <Link className="nav-links" to="/room">  <li>Room</li> </Link>
          <Link className="nav-links" to="/bed">  <li>Bed</li> </Link>
          <Link className="nav-links" to="/about">  <li>About</li> </Link>
        </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
