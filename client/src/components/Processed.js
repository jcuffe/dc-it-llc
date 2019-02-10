import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Paper, Grid, Typography } from "@material-ui/core";
import { Store } from "../state/store";
import DataTable from "./DataTable";

const paperStyle = { height: "80vh", width: 1000, paddingTop: 10 };

const fetchRows = async dispatch => {
  console.log("Fetching rows");
  const { data } = await axios.get(
    process.env.REACT_APP_BACKEND_URL + "/processed"
  );

  const processedColumns = Object.keys(data.rows[0]).map((key, i) => {
    const widths = [400, 200, 200, 200];
    return {
      width: widths[i],
      label: key,
      dataKey: key
    };
  });
  const processedRows = data.rows;
  console.log(processedRows);

  dispatch({ processedRows, processedColumns });
};

const Processed = () => {
  const { state, dispatch } = useContext(Store);
  // Initial row fetch
  useEffect(() => {
    fetchRows(dispatch);
  }, [true]);

  return (
    <Grid container justify="center">
      <Grid item xs={4}>
        <Typography gutterBottom variant="headline" align="center">
          Date Range
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography gutterBottom variant="headline" align="center">
          Processed Transactions
        </Typography>
        <Grid container justify="center">
          <Paper style={paperStyle}>
            <DataTable
              columns={state.processedColumns}
              rows={state.processedRows}
              onRowClick={null}
            />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Processed;
