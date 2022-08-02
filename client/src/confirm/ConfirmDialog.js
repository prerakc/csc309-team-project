import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmDialog(props) {
//   const [open, setOpen] = React.useState(false);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

  const handleClose = (rtnval) => {
    props.callback(rtnval)
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
            {props.titleText}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.bodyText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>Cancel</Button>
          <Button onClick={() => handleClose(true)} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
