import React, { useContext } from "react";
import { Switch, Route } from "react-router";
import { Store } from "../state/store";
import Navbar from "./Navbar";
import ProcessPayments from "./ProcessPayments";
import Processed from "./Processed";
import BillingTreeLatest from "./BillingTreeLatest";
import CsvExport from "./CsvExport";
import Login from "./Login";

const App = () => {
  const { state } = useContext(Store);
  if (state.username) {
    return (
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/" component={ProcessPayments} />
          <Route path="/processed" component={Processed} />
          <Route path="/latest-response" component={BillingTreeLatest} />
          <Route path="/csv-export" component={CsvExport} />
        </Switch>
      </div>
    );
  } else {
    return <Login />;
  }
};

export default App;
