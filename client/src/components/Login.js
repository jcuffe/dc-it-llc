import React, { useContext, useState } from "react";
import { TextField, Button, Paper, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Store } from "../state/store";

const styles = {
  header: {
    textAlign: "center",
    margin: "2rem 0"
  },
  input: {
    margin: "0.5rem 1rem"
  },
  submit: {
    margin: "1rem"
  },
  paper: {
    width: "30vw",
    margin: "2rem auto"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  }
};

const Login = ({ classes }) => {
  const { dispatch } = useContext(Store);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = e => {
    e.preventDefault();
    axios
      .post(process.env.REACT_APP_BACKEND_URL + "/auth/login", {
        username,
        password
      })
      .then(({ data: username }) => {
        if (username) {
          dispatch({ username });
        }
      })
      .catch(err => console.log(err));
  };
  return (
    <Paper className={classes.paper}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography className={classes.header} variant="h4">
          Log In
        </Typography>
        <TextField
          className={classes.input}
          id="username"
          label="User Name"
          value={username}
          onChange={e => setUsername(e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <TextField
          className={classes.input}
          id="password"
          label="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          margin="normal"
          variant="outlined"
          type="password"
        />
        <Button type="submit" className={classes.submit} variant="contained">
          Log In
        </Button>
      </form>
    </Paper>
  );
};

export default withStyles(styles)(Login);
