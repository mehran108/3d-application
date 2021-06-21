import React from "react";
import { Link } from "react-router-dom";
import './SideDrawer.css';

const SideDrawer = props => {
  let drawerClasses = 'side-drawer';
  if(props.show){
    drawerClasses = 'side-drawer open';
  }
  
  
  return (
    <nav className={drawerClasses}>
      <ul>
        <Link className="nav-links" to="/"><li>Home</li></Link>
        <Link className="nav-links" to="/chair">  <li>Chair</li> </Link>
        <Link className="nav-links" to="/sophie">  <li>Sophie</li> </Link>
        <Link className="nav-links" to="/house">  <li>House</li> </Link>
        <Link className="nav-links" to="/about">  <li>About</li> </Link>
      </ul>
  </nav>
  ) ;
}

export default SideDrawer;