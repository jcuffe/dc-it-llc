import React, { useContext, useEffect, useState } from "react";
import { Paper, Grid, Typography, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Store } from "../state/store";
import axios from "axios";
import DataTable from "./DataTable";
import Snackbar from "./Snackbar";

const styles = {
  paper: {
    height: "80vh",
    width: 1625,
    paddingTop: 10
  },
  button: {
    marginLeft: "1rem"
  }
};

const fetchRows = async dispatch => {
  console.log("Fetching rows");
  const {
    data: { rows }
  } = await axios.get(process.env.REACT_APP_BACKEND_URL + "/export/customers");

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

const CsvExport = ({ classes }) => {
  const { state, dispatch } = useContext(Store);
  let { columns, rows } = state.customer;
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackVariant, setSnackVariant] = useState("");
  const [snackMessage, setSnackMessage] = useState("");

  useEffect(() => {
    fetchRows(dispatch);
  }, [true]);

  const exportCsv = async () => {
    const { data } = await axios.post(process.env.REACT_APP_BACKEND_URL + "/export");
    if (data.success) {
      setSnackVariant("success");
      setSnackMessage(data.success);
    } else {
      setSnackVariant("error");
      setSnackMessage(data.error);
    }
    setSnackOpen(true);
  };
  
  const closeSnack = () => setSnackOpen(false);

  return (
    <Grid container justify="center">
      <Snackbar open={snackOpen} handleClose={closeSnack} variant={snackVariant} message={snackMessage} />
      <Grid item>
        <Typography gutterBottom variant="headline" align="center">
          Export Customer Data{" "}
          <Button
            className={classes.button}
            variant="contained"
            onClick={exportCsv}
          >
            Export
          </Button>
        </Typography>
        <Paper className={classes.paper}>
          <DataTable columns={columns} rows={rows} onRowClick={null} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(CsvExport);
