import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Paper, Grid, Typography } from "@material-ui/core";
import { Store } from "../state/store";
import { DateRange } from "react-date-range";
import DataTable from "./DataTable";

const paperStyle = { height: "80vh", width: 1000, paddingTop: 10 };

const fetchRows = async dispatch => {
  console.log("Fetching rows");
  const {
    data: { rows }
  } = await axios.get(process.env.REACT_APP_BACKEND_URL + "/processed");

  rows.forEach(
    row =>
      (row.Timestamp = moment(row.Timestamp).format("MMMM Do YYYY, h:mm:ss a"))
  );

  const columns = Object.keys(rows[0]).map((key, i) => {
    const widths = [400, 200, 200, 200];
    return {
      width: widths[i],
      label: key,
      dataKey: key
    };
  });
  console.log(rows);

  dispatch({
    processed: {
      rows,
      columns,
      filteredRows: [],
      startDate: moment().startOf("day"),
      endDate: moment().endOf("day")
    }
  });
};

const Processed = () => {
  const {
    state: { processed },
    dispatch
  } = useContext(Store);

  // Initial row fetch
  useEffect(() => {
    fetchRows(dispatch);
  }, [true]);

  // Apply date filter to rows
  useEffect(() => {
    const { rows, startDate, endDate } = processed;
    if (startDate && endDate) {
      let start = moment(startDate);
      let end = moment(endDate);
      if (start.isSame(end)) {
        start = start.subtract(24, "hours");
      }
      const filteredRows = rows.filter(row => {
        const date = moment(row.Timestamp, "MMMM Do YYYY, h:mm:ss a");
        if (moment(date).isBetween(start, end)) {
          return true;
        }
      });
      dispatch({ processed: { ...processed, filteredRows } });
    } else {
      dispatch({ processed: { ...processed, filteredRows: rows } });
    }
  }, [processed.rows.length, processed.startDate, processed.endDate]);

  const handleDateSelection = range => {
    const { startDate, endDate } = range;
    dispatch({ processed: { ...processed, startDate, endDate } });
  };

  return (
    <Grid container justify="center">
      <Grid item xs={4}>
        <Typography gutterBottom variant="headline" align="center">
          Date Range
        </Typography>
        <Grid container justify="center">
          <DateRange onChange={handleDateSelection} />
        </Grid>
      </Grid>
      <Grid item xs={8}>
        <Typography gutterBottom variant="headline" align="center">
          Processed Transactions
        </Typography>
        <Grid container justify="center">
          <Paper style={paperStyle}>
            <DataTable
              columns={processed.columns}
              rows={processed.filteredRows}
              onRowClick={null}
            />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Processed;
