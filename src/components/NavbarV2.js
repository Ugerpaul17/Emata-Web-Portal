import React, { Component } from 'react';
import 'react-dom';
import {Redirect} from 'react-router-dom';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import './stylings/navBarV2.css';

class NavBar extends Component {
  constructor(props){
    super(props)
    this.state = {
      coopsId: [],
      coops: [],//[{'name':'john','id':123},{'name':'paul','id':1234}],
      coopSelected: '',
      startDate: '',
      endDate: ''
    }
    this.logout=this.logout.bind(this);
    this.getCoopsList=this.getCoopsList.bind(this);
    this.maxDate=this.maxDate.bind(this);
    this.date_1_DefaultDate=this.date_1_DefaultDate.bind(this);
    this.date_2_DefaultDate=this.date_2_DefaultDate.bind(this);
    this.date_2_minDate=this.date_2_minDate.bind(this);
    this.onSelectCoop=this.onSelectCoop.bind(this);
    this.handleStartDateChange=this.handleStartDateChange.bind(this);
    this.handleEndDateChange=this.handleEndDateChange.bind(this);
    this.handleDefaultDateChange=this.handleDefaultDateChange.bind(this);
  }

  logout(){//this is the logout fuction
    localStorage.clear();//clearing the localstorage data
    if(!localStorage.getItem("Token")){//checking if the token was cleared
      console.log("I was logged out");
      return (//returning to the login page
        console.log("I was redirected"),
        <Redirect exact to={'/'}/>,//redirecting to the login page
        window.location.reload()//this is used to refresh the page
      )
    }
  }
  handleChange = (event) => {this.setState({ value: event.target.value })}
  /*handleDateChange = (newDate) => {
    this.setState({startDate: newDate});
    console.log("startDate "+ this.state.startDate);
  }*/
  componentDidUpdate(){
    
  }
  getCoopsList(){//this function populates the coops list in the search bar
    console.log("getCoopsList function has been called");
    fetch('https://emata-crmservice-test.laboremus.no/api/organisation',{
        headers: {
          'Authorization':'Bearer '+localStorage.getItem('Token'),
          'Transfer-Encoding': 'chunked',
          'Content-Type': 'application/json;charset=UTF-8',
          'Content-Encoding': 'gzip',
          'Vary':'Accept-Encoding',
          'X-Content-Type-Options':'nosniff',
        },
        method: 'GET'
    })
    .then(response=>response.json())
    .then(res=>{
      console.log(res);
      for (let i=0; i<res.length; i++) {
        if(res[i].isMainBranch){//checking if the coop is the main branch
          //this.state.coopsName.push(res[i].name);//this.state.coopsId.push(res[i].id);
          this.state.coops.push({'name':res[i].name,'id':res[i].id});
          //console.log(res[i].name);
        }
      }
      localStorage.setItem('cps',this.state.coops);
    })
    .catch((error)=>{
        return(error);//reject(error);
    });
  }
  handleStartDateChange(e){
    console.log(e.target.value);
    localStorage.setItem('startDt-sl',e.target.value);
    let newState = this.state;
    newState.startDate = String(e.target.value);
    this.setState(newState);
    //this.props.passDateSignal(this.state.startDate, this.state.endDate);
    console.log("startDate Change: "+ this.state.startDate);
  }
  handleEndDateChange(e){
    console.log(e.target.value);
    localStorage.setItem('endDt-sl',e.target.value);
    let newState = this.state;
    newState.endDate = String(e.target.value);
    this.setState(newState);
    this.props.passDateSignal(this.state.startDate, this.state.endDate);
    console.log("EndDate Change: "+ this.state.endDate);
  }
  handleDefaultDateChange(startDate,endDate){
    console.log("handleDefaultDateChange Called");
    this.props.passDateSignal(startDate, endDate);//this passes the dates props to the parent component
  }
  date_1_DefaultDate(){
    if(!localStorage.getItem('startDt-sl')){
      var curr = new Date();
      console.log("Default Curr date: "+curr);
      curr.setDate(curr.getDate()-7);
      var date = curr.toISOString().substr(0,10);
      localStorage.setItem('startDt-sl',date);
      console.log("Default 1 date: "+date);
      return date
    }
    else{return localStorage.getItem('startDt-sl');}
  }
  date_2_DefaultDate(){
    if(!localStorage.getItem('endDt-sl')){
      var curr = new Date();
      curr.setDate(curr.getDate());
      var date = curr.toISOString().substr(0,10);
      console.log("Default 2 date: "+date);
      localStorage.setItem('endDt-sl',date);
      return date
    }
    else{return localStorage.getItem('endDt-sl');}
  }
  date_2_minDate(){
    return localStorage.getItem('startDt-sl');
    //console.log("startDate: "+this.state.startDate);
    //console.log("endDate: "+this.state.endDate);
  }
  maxDate(){
    var curr = new Date();
    curr.setDate(curr.getDate());
    var date = curr.toISOString().substr(0,10);
    return date;
  }
  onSelectCoop(obj) {//this function gets the selected coop and saves it to local storage
    if(obj.length>0){//this checks if the obj array has a value
      console.log('onSelectCoop.call ', obj);
      console.log('onSelectCoop.name ', obj[0].name);
      //console.log('onSelectCoop.id ', obj[0].id);
      let newState = this.state;
      newState.coopSelected = obj[0].name;
      this.setState(newState);
      localStorage.setItem('cp-sl-id',obj[0].id);//saving the selected coop id to the localStorage
      localStorage.setItem('cp-sl-nm',obj[0].name);//saving the selected coop name to the localStorage
      //console.log( 'coopSelected '+this.state.coopSelected);
      this.props.passCoopSignal(obj[0].id,obj[0].name);
    }
  }

  render(){
    return (
      <div className="navBarStyle2">
            {this.getCoopsList()}
            <img className="navLogo2" src={require("./images/emata-logo.png")} alt={"logo"}/>
            <div className="pageName2">Dashboard</div>
            <Typeahead 
              bsSize="small"
              className="navBarSearch2"
              labelKey="name"
              onChange={(e)=>this.onSelectCoop(e)}
              options={this.state.coops}
              placeholder="search coops..."
              emptyLabel="no match found"
              selectHintOnEnter={true}
            />
            <div className="dateBackground2">
              <input 
                  id="myDate" 
                  type="date" 
                  className="dateBox2" 
                  name="" 
                  onChange={(e) => this.handleStartDateChange(e)}
                  defaultValue={this.date_1_DefaultDate()} 
                  min="2018-06-1" 
                  max={this.maxDate()}
              /> 
            </div>
            <label className="to2"> to </label>
            <div className="dateBackground2">
              <input 
                  type="date" 
                  className="dateBox2" 
                  name="" 
                  onChange={(e) => this.handleEndDateChange(e)} 
                  defaultValue={this.maxDate()} 
                  min={this.date_2_minDate()}
                  max={this.maxDate()}
              /> 
            </div>

            {this.handleDefaultDateChange(this.date_1_DefaultDate(),this.date_2_DefaultDate())}
            
            <img className="navBarUsernameIcon" src={require("./icons/userIcon3.png")} alt={"userIcon"}/>
            <div className="usernameLabel2">{localStorage.getItem("FirstName")}</div>
            <button className="navBarSignOutButton2" onClick={this.logout}>
              <div>
                <div className="usernameLabel2">Sign out</div>            
                <img className="navBarLogoutIcon" src={require("./icons/logoutIcon2.png")} alt={"userIcon"}/>
              </div>
            </button>
      </div>
    );
  }
}

export default NavBar;

/*(event) => {this.setState({startDate: event.target.value})
                console.log(event.target) 
                console.log("startDate Change: "+ this.state.startDate)}*/