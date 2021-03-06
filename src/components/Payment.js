import React, { Component } from 'react';
import 'react-dom';
import './stylings/payments.css';
import Highcharts from 'highcharts';
import {HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title, Legend, ColumnSeries, SplineSeries} from 'react-jsx-highcharts';

class Payment extends Component {
	constructor() {
	    super();
	    this.state = {
	      data: [0,0,0],
	      Gduration: 1500
	    };
	    this.paymentMethod=this.paymentMethod.bind(this);
	    this.refresh=this.refresh.bind(this);
  	}
  	componentDidMount() {
  	   //*
  	   var org_id = localStorage.getItem('cp-sl-id');
  	   console.log("org id: ", org_id);
	   this.paymentMethod(org_id);
	   //this.paymentMethod();//*/
	   /*
	   console.log("Component mounted");
	   let newState= this.state;
	   newState.data[0] = 90;
	   newState.data[1] = 30;
	   newState.data[2] = 120;
	   this.setState(newState);//*/
	}
	refresh(){
	   console.log("refreshed");
	   let newState= this.state;
	   newState.data[0] = 20;
	   newState.data[1] = 150;
	   newState.data[2] = 10;
	   newState.Gduration = 1501;
	   this.setState(newState);//*/
	}
	shouldComponentUpdate(){
		return true
	}
	paymentMethod(id){//this function populates the payment method list in the payment graph
	    console.log("paymentMethod function has been called");
	    fetch(" https://emata-crmservice-test.laboremus.no/api/payment/method?organisationId="+id,
			{
		      headers: {
		        Authorization: "Bearer " + localStorage.getItem("Token"),
		        "Transfer-Encoding": "chunked",
		        "Content-Type": "application/json;charset=UTF-8",
		        "Content-Encoding": "gzip",
		        Vary: "Accept-Encoding",
		        "X-Content-Type-Options": "nosniff"
		      },
		      method: "GET"
		    })
	      .then(response => response.json())
	      .then(res=>{
	        let contact = res;
	        let len = contact.length;
	        let Cash = 0;
	        let Bank= 0;
	        let MobileMoney = 0;

	        for(let i = 0; i < len; i++){
	          if(contact[i].paymentMethod===2){
	            Cash = Cash +1; 
	          }
	          else if(contact[i].paymentMethod===1){
	            Bank = Bank +1;
	          }
	          else if(contact[i].paymentMethod===3){
	            MobileMoney = MobileMoney +1;
	          }
	          else {return null}
	        }
	        console.log(Cash, Bank, MobileMoney);

	        let newState= this.state;
	        newState.data[0] = Bank;
	        newState.data[1] = Cash;
	        newState.data[2] = MobileMoney;
	   		newState.Gduration = 1501;
	        console.log("state: ", this.state);
	        this.setState(newState);
	      })
	      .catch(error => {
	        return error; //reject(error);
	      });
	      return true;
  	}
 	render(){
 		//var org_data = localStorage.getItem('cp-sl');
 		//{this.paymentMethod(org_data.id)}
 		const categories= ['Bank', 'Cash', 'MobileMoney'];
  		const labels= {style: {fontSize:'40px'}}
	 	const plotOptions = {
    		series: {
    			animation:{duration: this.state.Gduration},
    		}
  		};
  		let series = {
        	series: [{
		        type: 'column',
		        colorByPoint: true,
		        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
		        showInLegend: false
		    }]
        }
  		var tooltip = {valueSuffix: 'farmers'}
	    return(
	    	<div className="topDiv">
	    		{console.log("render started")}
	    		
		        <HighchartsChart  
		        	className="paymentGraph"
					plotOptions={plotOptions} 
			        tooltip={tooltip}
			    >
			    <Chart 
			        series={series}
			    />
		          <XAxis categories={categories} lable = {labels}>
		          	<XAxis.Title >Channels</XAxis.Title>
		          </XAxis>
		          <YAxis>
		          	<YAxis.Title >No. of farmers</YAxis.Title>
		            <ColumnSeries id="graph" name="Farmers" data={this.state.data}/>
		          </YAxis>
		        </HighchartsChart>
	        </div>
	    );
    } 
}

export default withHighcharts(Payment, Highcharts);

/*
	<button className="deliveryButtons" onClick={(e)=>{e.preventDefault();this.refresh()}}>refresh</button>
*/