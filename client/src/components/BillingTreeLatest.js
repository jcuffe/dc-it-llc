import React, { useContext, useEffect, useState } from "react";
import { Paper, Grid, Typography } from "@material-ui/core";
import { Store } from "../state/store";
import DataTable from "./DataTable";

const paperStyle = { height: "80vh", width: 1270, paddingTop: 10 };

const BillingTreeLatest = () => {
  const { state, dispatch } = useContext(Store);
  let columns, rows;
  if (state.billingTree.rows.length) {
    rows = state.billingTree.rows;
    columns = Object.keys(rows[0]).map((key, i) => {
      const widths = [200, 350, 420, 300];
      return {
        width: widths[i],
        label: key,
        dataKey: key
      };
    });
  } else {
    columns = [];
    rows = [];
  }

  return (
    <Grid container justify="center">
      <Grid item>
        <Typography gutterBottom variant="headline" align="center">
          Latest BillingTree Response
        </Typography>
        <Paper style={paperStyle}>
          <DataTable columns={columns} rows={rows} onRowClick={null} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default BillingTreeLatest;
