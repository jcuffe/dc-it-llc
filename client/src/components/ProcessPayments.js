import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import {
  Paper,
  Grid,
  Toolbar,
  Button,
  Typography,
  FormControl,
  FormGroup,
  OutlinedInput,
  Select,
  MenuItem,
  InputLabel,
  TextField
} from "@material-ui/core";
import { Store } from "../state/store";
import DataTable from "./DataTable";

const paperStyle = { height: "35vh", width: 1270, paddingTop: 10 };

const fetchRows = async dispatch => {
  const { data } = await axios.get(
    process.env.REACT_APP_BACKEND_URL + "/payments"
  );

  const columns = Object.keys(data.rows[0]).map((key, i) => {
    const widths = [100, 100, 300, 200, 180, 160, 100, 200, 130, 100];
    return {
      width: widths[i],
      label: key,
      dataKey: key
    };
  });
  const rows = data.rows;

  dispatch({ rows, columns });
};

const sendTransactions = async transactions => {
  const { data } = await axios.post(
    process.env.REACT_APP_BACKEND_URL + "/process",
    transactions
  );
  return data;
};

const CSG = () => {
  const { state, dispatch } = useContext(Store);

  // Move a row into the processing queue
  const onRowClick = ({ rowData }) => {
    const { selectedRows, rows, filteredRows } = state;
    selectedRows.push(rowData);
    const spliceIndex = rows.findIndex(row => row.id === rowData.id);
    rows.splice(spliceIndex, 1);
    dispatch({ selectedRows, rows });
  };

  // Send transactions to BillingTree
  const onSendTransactions = async () => {
    const rows = await sendTransactions(state.selectedRows);
    dispatch({ selectedRows: [], billingTree: { rows } });
  };

  // Initial row fetch
  useEffect(() => {
    fetchRows(dispatch);
  }, [true]);

  // Apply filter query to row data
  useEffect(() => {
    console.log("applying filter");
    const { filterText, filterBy, rows } = state;
    if (filterText !== "") {
      const filteredRows = rows.filter(row =>
        row[filterBy]
          .toString()
          .toLowerCase()
          .includes(filterText.toLowerCase())
      );
      dispatch({ filteredRows });
    } else {
      dispatch({ filteredRows: rows });
    }
  }, [state.rows.length, state.filterText]);

  return (
    <Grid container justify="center">
      <Grid item>
        <Typography gutterBottom variant="headline" align="center">
          Transactions to process
        </Typography>
        <Paper style={paperStyle}>
          <DataTable columns={state.columns} rows={state.selectedRows} />
        </Paper>
        <Toolbar>
          <Button onClick={onSendTransactions} variant="contained">
            Send Selected Transactions
          </Button>
          <FormGroup row>
            <FilterSelect />
            <FilterInput />
          </FormGroup>
        </Toolbar>
        <Typography gutterBottom variant="headline" align="center">
          Unprocessed Transactions
        </Typography>
        <Paper style={paperStyle}>
          <DataTable
            columns={state.columns}
            rows={state.filteredRows}
            onRowClick={onRowClick}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

const FilterSelect = () => {
  const { state, dispatch } = useContext(Store);
  const [labelWidth, setLabelWidth] = useState(0);
  let labelRef;
  const handleChange = e => dispatch({ filterBy: e.target.value });
  useEffect(() => {
    if (labelRef) {
      setLabelWidth(ReactDOM.findDOMNode(labelRef).offsetWidth);
    }
  }, [labelRef]);
  return (
    <FormControl variant="outlined" style={{ minWidth: 180, margin: 16 }}>
      <InputLabel ref={ref => (labelRef = ref)}>Filter by</InputLabel>
      <Select
        value={state.filterBy}
        onChange={handleChange}
        input={<OutlinedInput labelWidth={labelWidth} />}
      >
        <MenuItem value="">
          <em>Sort by</em>
        </MenuItem>
        {state.columns.map((column, i) => (
          <MenuItem value={column.dataKey} key={i}>
            {column.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const FilterInput = () => {
  const { state, dispatch } = useContext(Store);
  const handleChange = e => dispatch({ filterText: e.target.value });
  return (
    <TextField
      id="filter-text"
      label="Filter"
      value={state.filterText}
      onChange={handleChange}
      margin="normal"
      variant="outlined"
    />
  );
};

export default CSG;
