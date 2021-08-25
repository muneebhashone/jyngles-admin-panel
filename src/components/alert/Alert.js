/* eslint-disable */

import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog({
  handleOpen,
  handleClose,
  children,
  title,
  handleYes,
  handleNo
}) {
  return (
    <div>
      <Dialog
        open={handleOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleYes} color="primary">
            Yes
          </Button>
          <Button onClick={handleNo} color="primary" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
