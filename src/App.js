import React ,{useState, useEffect} from 'react';
import './App.css';
import { BrowserRouter } from "react-router-dom";
import AllRoutes from './routes/main'
import Header from './components/partials/Navbar/header'
import SideDrawer from './components/partials/SideDrawer/SideDrawer';
import Backdrop from './components/partials/Backdrop/Backdrop';

const App = () =>  {
  const [SideDrawerOpen,setSideDrawerOpen] = useState(false);
  useEffect(()=>{
    console.log('Effect run');
  },[])
  let backdrop;

  const drawerToggleHandler = async () =>{
    await setSideDrawerOpen(!SideDrawerOpen);
  }
  const backdropClickHandler = async () =>{
    await setSideDrawerOpen(false);
  }

  if(SideDrawerOpen){
     backdrop = <Backdrop click={backdropClickHandler} />;
  }

    return (
      <BrowserRouter>
      <div style={{height:'100%'}} >
          <Header drawerToggleHandler = {drawerToggleHandler} />
          <SideDrawer show ={SideDrawerOpen} />
          {backdrop}
          <main className="content-wrapper" style={{marginTop:'40px'}}>
            <AllRoutes/>
        </main>
        </div>
      </BrowserRouter>
    );
  
};


export default App;
