import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Switch, Route } from "react-router";
import { Store } from "../state/store";
import Navbar from "./Navbar";
import ProcessPayments from "./ProcessPayments";
import Processed from "./Processed";
import BillingTreeLatest from "./BillingTreeLatest";
import CsvExport from "./CsvExport";
import Login from "./Login";

axios.defaults.withCredentials = true;

const App = () => {
  const { state, dispatch } = useContext(Store);
  const [loading, setLoading] = useState(false);

  const checkLoginStatus = async () => {
    setLoading(true);
    const { data } = await axios.get(process.env.REACT_APP_BACKEND_URL + "/auth/profile");
    if (data.username) {
      dispatch({ username: data.username });
    }
    setLoading(false);
  };

  useEffect(() => {
    checkLoginStatus()
  }, [true]); 

  if (loading) {
    return null;
  }

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
