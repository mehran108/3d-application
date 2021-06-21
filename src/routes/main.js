import React from 'react';
import { Route, Switch } from "react-router-dom";
import Home from "../components/Home";
import Chair from "../components/Chair/Chair";
import House from "../components/House";
import Sophie from "../components/Sophie";
import About from "../components/About";
import Room from "../components/Room/Room";
import Bed from "../components/Bed/Bed";

const Routes = () => {
  return (
    <div className="app-wrapper">
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/chair" component={Chair} />
        <Route path="/sophie" component={Sophie} />
        <Route path="/bed" component={Bed} />
        <Route path="/about" component={About} />
        <Route path="/room" component={Room} />
      </Switch>
    </div>
  );
};

export default Routes;
