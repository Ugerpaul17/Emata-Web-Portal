import React from "react";
import {Redirect} from 'react-router-dom';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Navbar from "./components/Navbar";
import MonthlyOverview from './components/monthlyOverview';
import DeliveryAmounts from './components/deliveryAmounts';
import Payment from './components/Payment';
import './stylings/dashboard.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 40
  },
  paper: {
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.down("sm")]: {
      //backgroundColor: theme.palette.secondary.main
    },
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "100%"
  },
  redirect:{
    status: false
  }
});

function FullWidthGrid(props) {
  const { classes } = props;
  if(!localStorage.getItem("Token")){
    return (<Redirect exact to={'/'}/>)
  }
  else{
    return <div>
      <div><Navbar /></div>
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6}>
            <Paper className="monthlyOVCard">
              <p className="cardNames">Milk collections</p>
              <MonthlyOverview/>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className="deliveryDetailsCard">
              <p className="cardNames">Deliveries</p>
              <DeliveryAmounts/>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className="paymentCard">
              <p className="cardNames">Farmers</p>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className="paymentCard">
              <p className="cardNames">Payments</p>
              <Payment/>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3} lg={2}>
            <Paper className="bottomCard2">
              <p className="cardNames">Utilization Rate</p>
            </Paper>
          </Grid>
        </Grid>
      </div>;
    </div>
  }
}

FullWidthGrid.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FullWidthGrid);


