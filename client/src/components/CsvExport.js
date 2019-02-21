import React, { useContext, useEffect, useState } from "react";
import { Paper, Grid, Typography, Button } from "@material-ui/core";
import { Store } from "../state/store";
import axios from "axios";
import DataTable from "./DataTable";

const paperStyle = { height: "80vh", width: 1625, paddingTop: 10 };

const fetchRows = async dispatch => {
  console.log("Fetching rows");
  const {
    data: { rows }
  } = await axios.get(process.env.REACT_APP_BACKEND_URL + "/customers");

  console.log(rows);
  const columns = Object.keys(rows[0]).map((key, i) => {
    const widths = [75, 150, 150, 150, 150, 75, 100, 175, 150, 150, 150, 150];
    return {
      width: widths[i],
      label: key,
      dataKey: key
    };
  });

  dispatch({
    customer: {
      rows,
      columns
    }
  });
};

const CsvExport = () => {
  const { state, dispatch } = useContext(Store);
  let { columns, rows } = state.customer;

  useEffect(() => {
    fetchRows(dispatch);
  }, [true]);

  const exportCsv = () => {
    axios.post(process.env.REACT_APP_BACKEND_URL + "/csv-export")
  }

  return (
    <Grid container justify="center">
      <Grid item>
        <Typography gutterBottom variant="headline" align="center">
          Export Customer Data <Button onClick={exportCsv}>Export</Button>
        </Typography>
        <Paper style={paperStyle}>
          <DataTable columns={columns} rows={rows} onRowClick={null} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CsvExport;