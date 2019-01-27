import React, { useContext } from "react";
import { Grid } from "@material-ui/core";
import { Store } from "../state/store";
import CSG from "./csg";

const App = () => {
  return (
    <Grid container justify="center">
      <CSG />
    </Grid>
  );
};

export default App;
