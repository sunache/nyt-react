import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import red from "@material-ui/core/colors/red";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';

const styles = theme => ({
  card: {
    maxWidth: "100%"
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: "auto"
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
});

class Search extends React.Component {
  state = { expanded: false };

  render() {
    const { classes } = this.props;

    return (
      <div className = "container" >
        <Card className={classes.card}>
                <CardHeader
                    title="Search For Articles" />

          <CardContent>
            <TextField
              id="full-width"
              label="Topic"
              InputLabelProps={{
                shrink: true
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              id="full-width"
              label="Start Year"
              InputLabelProps={{
                shrink: true
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              id="full-width"
              label="End Year"
              InputLabelProps={{
                shrink: true
              }}
              fullWidth
              margin="normal"
                    />
        <Button variant="contained" color="primary" className={classes.button}>
        Search
      </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Search);
