import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { Provider } from "./state/store";
import CssBaseline from "@material-ui/core/CssBaseline";

const app = (
  <Provider>
    <CssBaseline />
    <App />
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
