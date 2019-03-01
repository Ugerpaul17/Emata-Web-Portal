import React, {Component} from 'react';
import 'react-dom';
import {Redirect} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import './stylings/loginPage.css';
import { Alert } from 'reactstrap';
import Loader from './components/loadingLogin';
import * as serviceWorker from './serviceWorker';//import {PostData} from './PostData.js'

class Login extends Component {

    constructor(props){
        super(props);

        this.state = {
            loginDetails:{
                username: '',
                password:'',
                clientId:'backoffice',
                clientSecret:'backoffice@lug'
            },
            errorMessageState:{
                visible: false,
                errorMsg: ''
            },
            portalPages:{
                redirect: false
            },
            showLoader: false
        }

        this.login=this.login.bind(this);
        this.updateInputUser=this.updateInputUser.bind(this);
        this.updateInputPass=this.updateInputPass.bind(this);
        this.validation=this.validation.bind(this);
        this.verification=this.verification.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.onShowAlert = this.onShowAlert.bind(this);
        this.onDismissAlert = this.onDismissAlert.bind(this);
    }
    login(){
       console.log(this.state);
       if(this.validation()===true){
            let newState = this.state;
            newState.showLoader=true;
            this.setState(newState);
            fetch('https://emata-authservice-test.laboremus.no/users/login',{
               headers: {
                    'Access-Control-Allow-Origin':'http://localhost:3000/',
                    'Accept':'application/json',
                    'Content-Type':'application/json',//'application/x-www-form-urlencoded',//'application/json;charset=UTF-8',
                    'Content-Encoding':'gzip',
                    'Access-Control-Allow-Headers':'Origin, Authorization, X-Requested-With, Content-Type, Accept, Cache-Control',
                    'Access-Control-Allow-Credentials':'true',
                    'Access-Control-Allow-Methods':'POST',
                    'Transfer-Encoding': 'chunked',
                    'Vary':'Accept-Encoding',
                    'X-Content-Type-Options':'nosniff',
                },
                method:'POST',
                //mode: 'no-cors',
                body: JSON.stringify(this.state.loginDetails)
            })
            .then(response=>response.json())
            .then(res=>{
                //console.log(res);
                //this.verification(res.accessToken,res.identityToken.userID,res.identityToken.firstName,res.identityToken.lastName,res.expiresIn,res.message);
                this.verification(res);
            })
        }
    }
    verification(serverResponse){
        console.log("This is the feedback: "+this.verification.serverResponse);
        console.log("---------------------------------------");
        console.log("Status: "+serverResponse.code);
        if(serverResponse.code===400){//please try again later alert needed

        }
        else if(serverResponse.code===500){
            console.log("---------------------------------------");
            console.log("StatusMessage: "+serverResponse.message);
            this.onShowAlert("username or password is INCORRECT");
            let newState = this.state;
            newState.showLoader=false
            this.setState(newState);
        }
        else{
            //this.props.passDetails(this.state.loginDetails);//passing login details to index component/parent
            localStorage.setItem('cred',this.state.loginDetails);//passing login details to LocalStorage
            console.log("---------------------renewTokenDetails login: ", this.state.loginDetails);
            console.log("---------------------------------------");
            localStorage.setItem('Token',serverResponse.accessToken);//saving the token to local storage in the browser
            console.log("Access Token: "+serverResponse.accessToken);
            console.log("---------------------------------------");
            localStorage.setItem('UserID',serverResponse.identityToken.userId);//saving the userID to local storage in the browser
            console.log("User ID: "+serverResponse.identityToken.userId);
            console.log("---------------------------------------");
            localStorage.setItem('FirstName',serverResponse.identityToken.firstName);//saving the first name to local storage in the browser
            console.log("First Name: "+serverResponse.identityToken.firstName);
            console.log("---------------------------------------");
            localStorage.setItem('LaststName',serverResponse.identityToken.lastName);//saving the last name to local storage in the browser
            console.log("Last Name: "+serverResponse.identityToken.lastName);
            console.log("---------------------------------------");
            this.setState({redirect: true});
        }
    }
    validation(){//this function checks username and password inputs before going forward to post the data
        if(!this.state.loginDetails.username || this.state.loginDetails.username === "" || this.state.loginDetails.username ===" "){
            this.onShowAlert("Your username is required");
            console.log("Your username '"+this.state.loginDetails.username+"' is required.");
            return false;
        }
        else if(!this.state.loginDetails.password || this.state.loginDetails.password === "" || this.state.loginDetails.password ===" "){
            this.onShowAlert("Your password is required");
            console.log("Your password '"+this.state.loginDetails.password+"' is required.");
            return false;
        }
        else{
            console.log("Your username '"+this.state.loginDetails.username+"' is VALID.");
            console.log("Your password '"+this.state.loginDetails.password+"' is VALID.");
            return true;
        }
    }
    updateInputUser(event){//this function is called to update the state name of loginDetails object
        var abc = this.state.loginDetails;
        abc.username = event.target.value;
        this.setState({loginDetails: abc});
        console.log(this.state.loginDetails);
        if((!this.state.loginDetails.username || this.state.loginDetails.username === "" || this.state.loginDetails.username ===" ")&(this.state.errorMessageState.errorMsg==="Your password is required" || this.state.errorMessageState.errorMsg==="username or password is INCORRECT")){
            this.onDismissAlert();//this dismisses the alert message if the username input is editted to nothing or empty "".
            return false;
        }
    }
    updateInputPass(event){//this function is called to update the state password of loginDetails object
        var abc = this.state.loginDetails;//saves the whole object in var abc
        abc.password = event.target.value;//change the value of username in the object var abc
        this.setState({loginDetails: abc});//assigns the whole object loginDetails to abc
        console.log(this.state.loginDetails);
        if((!this.state.loginDetails.password || this.state.loginDetails.password === "" || this.state.loginDetails.password ===" ")&(this.state.errorMessageState.errorMsg==="Your password is required" || this.state.errorMessageState.errorMsg==="username or password is INCORRECT")){
            this.onDismissAlert();//this dismisses the alert message if the username input is editted to nothing or empty "".
            return false;
        }
    }
    onShowAlert(statement) {
        var abc = this.state.errorMessageState;
        abc.errorMsg = statement;
        abc.visible = true;
        this.setState({errorMessageState: abc});
        console.log("errorMessageState: "+this.state.errorMessageState);
    }
    onDismissAlert() {
        var abc = this.state.errorMessageState;
        abc.visible = false;
        this.setState({errorMessageState: abc});
        console.log("errorMessageState: "+this.state.errorMessageState);
    }
    showLoader(){
        console.log("showLoader Started");
        if(this.state.showLoader){console.log("Tab1 is selected");return <Loader/>}
    }
 
    render(){
        if(this.state.redirect){
            return (<Redirect to={'/dashboard'}/>)
        }
        return(
            <div className="parentDiv">
                <div className="mainDiv">
                    <img className="loginLogo" src={require("./images/emata-logo.png")} alt={"logo"}/>
                      <div className="form-group-ab7">
                        <div className="inputBackground">
                            <img className="loginIconUsername" src={require("./icons/userIcon.png")} alt={"userIcon"}/>
                            <input type="text" className="inputBoxUsername" name="" placeholder="username" onChange={this.updateInputUser}/> 
                        </div>
                      </div> 
                      <div className="form-group-ab7"> 
                        <div className="inputBackground">
                          <img className="loginIconPassword" src={require("./icons/keyIcon.png")} alt={"userIcon"}/>
                          <input type="password" className="inputBoxPassword" name="" placeholder="password" onChange={this.updateInputPass}/> 
                        </div>
                      </div> 
                    <div className="form-group-ab7"> 
                       <input type="submit" className="loginButton" onClick={this.login} value="sign in"/>
                    </div>
                    <Alert className="errorMessageDiv" isOpen={this.state.errorMessageState.visible} >
                        <p className="errorMessage">{this.state.errorMessageState.errorMsg}</p>
                    </Alert> 
                    <div className="loading">{this.showLoader()}</div>
                </div>
            </div>
        );
    } 
}
export default Login;
//ReactDOM.render(<Login />, document.getElementById('just'));
//serviceWorker.unregister();