import React, { Component } from 'react';
import * as API from './api/API';
import { Route, withRouter, Switch } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './App.css';
import Login from './components/login';
import SignUp from './components/signup';
import Home from './components/home';
import VerifyAccount from './components/verifyaccount'
import CreateSurvey from './components/createsurvey/createsurvey';
import SurveyResponse from './components/surveyresponse/surveyresponse';
import {login_success} from './actions/login';

class App extends Component {

    handlePageChange = ((page)=>{
        this.props.history.push(page);
    });

    validateSession = (()=>{
        API.validateSession().then((response) => {
            console.log(response.status);
            if(response.status === 200){
                response.json().then((data) => {
                    this.props.login_success(data);
                });
                this.handlePageChange("/home");
            }
            else if(response.status === 404) {
                this.setState({
                    ...this.state,
                    isLoggedIn : false,
                    email : ""
                });
                this.handlePageChange("/login");
            }
            else {
                this.handlePageChange("/login");
            }
        });
    });

    componentDidMount(){
    }

    render() {
        return (
            <div className="App">
                <Switch>
                    <Route exact path= "/" render={() =>(
                        <div>
                            {this.validateSession()}
                        </div>
                    )}/>
                    <Route path= "/signup" render = {() => (
                        <SignUp
                            handlePageChange = {this.handlePageChange}
                        />)}
                    />
                    <Route path= "/login" render = {() => (
                        <Login
                            handlePageChange = {this.handlePageChange}
                        />)}
                    />
                    <Route path= "/home" render = {() => (
                        <Home
                            handlePageChange = {this.handlePageChange}
                            validateSession = {this.validateSession}
                        />)}
                    />
                    <Route path= "/verifyaccount/:token" render = {(...match) => (
                        <VerifyAccount
                            handlePageChange = {this.handlePageChange}
                            context={match}
                        />)}
                    />
                    <Route path= "/survey/:survey_id" render = {(match) => (
                        <SurveyResponse
                            handlePageChange = {this.handlePageChange}
                            {...match}
                        />)}
                    />
                    <Route path= "/survey/:survey_id/:response_id" render = {(match) => (
                        <SurveyResponse
                            handlePageChange = {this.handlePageChange}
                            {...match}
                        />)}
                    />
                </Switch>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        state: state
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({login_success: login_success}, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
