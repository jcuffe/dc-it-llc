import React, { useContext } from "react";
import { Grid } from "@material-ui/core";
import { Switch, Route } from "react-router";
import Navbar from "./Navbar";
import ProcessPayments from "./ProcessPayments";
import Processed from "./Processed";
import BillingTreeLatest from "./BillingTreeLatest";

const App = () => {
  return (
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/" component={ProcessPayments} />
        <Route path="/processed" component={Processed} />
        <Route path="/latest-response" component={BillingTreeLatest} />
      </Switch>
    </div>
  );
};

export default App;
