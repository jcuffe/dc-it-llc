import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { Provider } from "./state/store";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

const app = (
  <Provider>
    <CssBaseline />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
