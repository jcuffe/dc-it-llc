import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CheckCircle, Error, Info, Close, Warning } from '@material-ui/icons';
import { green, amber, red, blue } from '@material-ui/core/colors';
import { IconButton, Snackbar, SnackbarContent, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const variantIcon = {
  success: CheckCircle,
  warning: Warning,
  error: Error,
  info: Info,
};

const styles = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: red[600],
  },
  info: {
    backgroundColor: blue[600]
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: "1rem"
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

const SnackContent = (props) => {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <Close className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

const SnackContentWrapper = withStyles(styles)(SnackContent);

const Snack = ({ open,  message, variant, handleClose }) => (
  <Snackbar
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    open={open}
    autoHideDuration={6000}
    onClose={handleClose}
  >
    <SnackContentWrapper
      onClose={handleClose}
      variant={variant}
      message={message}
    />
  </Snackbar>
);

export default Snack;
