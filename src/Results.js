import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import SnackbarContent from "@material-ui/core/SnackbarContent";

const action = (
  <Button variant="contained" color="primary">
    Save
  </Button>
);

const styles = theme => ({
  snackbar: {
    margin: theme.spacing.unit,
    maxWidth: "100%",
    fontSize: 26
  }
});

function Results(props) {
  const { classes } = props;

  return (
    <div className = "container">
      <SnackbarContent
        className={classes.snackbar}
        message={
          "I love candy. I love cookies. I love cupcakes. \
          I love cheesecake. I love chocolate."
        }
        action={action}
      />
    </div>
  );
}

Results.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Results);
