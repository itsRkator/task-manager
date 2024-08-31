import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Task } from "../types";
import { Typography } from "@mui/material";
import { format } from "date-fns";

// Transition component for the dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ViewTaskProps {
  task: Task;
  handleDialog: React.Dispatch<React.SetStateAction<boolean>>;
  isDialogOpened: boolean;
}

const ViewTasDialog: React.FC<ViewTaskProps> = ({
  task,
  isDialogOpened,
  handleDialog,
}) => {
  const handleClose = () => {
    handleDialog(false); // Directly set dialog state to false
  };

  const formattedDate = format(new Date(task.createdAt), "dd/MM/yyyy HH:mm:ss");

  return (
    <Dialog
      open={isDialogOpened}
      TransitionComponent={Transition}
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        sx: {
          width: "80%", // Set desired width
          maxWidth: "600px", // Max width
          height: "70%", // Set desired height
          maxHeight: "600px", // Max height
        },
      }}
    >
      <DialogTitle>
        <Typography
          color="primary"
          component="h5"
          variant="h5"
          textAlign="left"
        >
          Task Details
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <Typography variant="body1" component="h6" gutterBottom>
            Title: {task.title}
          </Typography>
          <Typography variant="body1" component="p" gutterBottom>
            Description: {task.description}
          </Typography>
          <Typography variant="body2" component="p" color="textSecondary">
            Created at: {formattedDate}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ textTransform: "none" }}
          onClick={handleClose}
          variant="contained"
          color="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewTasDialog;
