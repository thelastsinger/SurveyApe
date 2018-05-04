import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateAnswer, createSurveyResponse} from './../../actions/surveyresponse';
import uuidv4 from "uuid";
import * as API from './../../api/API';
import {question_types} from './../../config/question_types';
import StarRatingComponent from 'react-star-rating-component';
import '../../stylesheets/surveyresponse/surveyquestioncomponent.css';

class QuestionComponent extends Component {

    constructor(){
        super();
        this.state = {
            rating: 0
        }
    }

    response = {
        survey_id:"",
        response_id:"",
        response_answer:""
    };

    getDefaultAnswer = ((question_id, option, question_type)=>{
        let responses = this.props.survey_response.responses;
        switch(question_type){
            case question_types.CHECKBOX:
            case question_types.RADIOGROUP:
            case question_types.DROPDOWN:
                for (let i = 0; i < responses.length; i++) {
                    if (responses[i].question.question_id === question_id) {
                        if (responses[i].answer_value === option.option_id) {
                            return true;
                        }
                    }
                }
                return false;
                break;
            case question_types.YESNO:
                for (let i = 0; i < responses.length; i++) {
                    if (responses[i].question.question_id === question_id) {
                        if (responses[i].answer_value === option) {
                            return true;
                        }
                    }
                }
                return false;
                break;
            case question_types.STARRATING:
            case question_types.SHORTANSWER:
            case question_types.DATETIME:
                console.log("question_type: ", question_type);
                for (let i = 0; i < responses.length; i++) {
                    if (responses[i].question.question_id === question_id) {
                        console.log("question_type: ", responses[i].answer_value);
                        return  responses[i].answer_value
                    }
                }
                return "Empty";
                break;
            default:
                console.log("Incorrect Questino Type");
                break

        }
        console.log("doesContainAnswer: ", this.props.survey_response.responses);
    });

    findAnswer = ((question_id, option, question_type)=>{
        console.log("findAnswer:    ");
        console.log(this.props.survey_response.responses);
        console.log(question_id);
        console.log(option);
        if(question_type === question_types.CHECKBOX) {
            let responses = this.props.survey_response.responses;
            for (let i = 0; i < responses.length; i++) {
                if (responses[i].question.question_id === question_id) {
                    console.log("Question Id Match", true);
                    if (responses[i].answer_value === option.option_id) {
                        console.log("found answer: ", true, responses[i]);
                        return responses[i];
                    }
                }
            }
        }
        else {
            console.log("Not a checkbox");
            let responses = this.props.survey_response.responses;
            for (let i = 0; i < responses.length; i++) {
                if (responses[i].question.question_id === question_id) {
                    console.log("Question Id Match", true, responses[i]);
                    return responses[i];
                }
            }
        }
        console.log("Not found answer: ", false);
    });

    getQuestionView(){
        return (
            <div>
                <input className="survey-question-input-box" type="text"
                       placeholder="Type your question here"
                       onChange={(event) => {
                           this.editQuestionText(event.target.value);
                       }}
                       disabled="true"
                       defaultValue={this.props.questions[this.props.index_id].question_text}
                />
            </div>
        );
    }

    sendSurveySaveRequest = ((res, type)=>{
        if(type === question_types.CHECKBOX){
            console.log(JSON.stringify(res));
            console.log("sendSurveySaveRequest: ", res);
            API.updateCheckBoxAnswer(res).then((response)=>{
                console.log(response.status);
                if(response.status===200){
                    response.json().then((data)=>{
                        console.log("sendSurveySaveRequest received: ", data);
                        this.props.createSurveyResponse(data);
                    })
                }
                else {
                    console.log("Error");
                }
            });
        }
        else {
            console.log(JSON.stringify(res));
            console.log("sendSurveySaveRequest: ", res);
            API.updateReponseAnswer(res).then((response)=>{
                console.log(response.status);
                if(response.status===200){
                    response.json().then((data)=>{
                        console.log("sendSurveySaveRequest received: ", data);
                        this.props.createSurveyResponse(data);
                    })
                }
                else {
                    console.log("Error");
                }
            });
        }
    });

    getAnswerId = ((question_id, option, question_type)=>{
        console.log("findAnswer:    ");
        console.log(this.props.survey_response.responses);
        console.log(question_id);
        console.log(option);
        if(question_type === question_types.CHECKBOX) {
            let res = this.findAnswer(question_id,option, question_type);
            let responses = this.props.survey_response.responses;
            for (let i = 0; i < responses.length; i++) {
                if (responses[i].question.question_id === question_id) {
                    console.log("Question Id Match", true);
                    if (responses[i].answer_value === option.option_id) {
                        console.log("found answer: ", true, responses[i]);
                        return responses[i];
                    }
                }
            }
        }
        else {
            console.log("Not a checkbox");
            let responses = this.props.survey_response.responses;
            for (let i = 0; i < responses.length; i++) {
                if (responses[i].question.question_id === question_id) {
                    console.log("Question Id Match", true, responses[i]);
                    return responses[i];
                }
            }
        }
        console.log("Not found answer: ", false);
    });

    onStarClick(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
    }

    getOptionView(){
        let question_id = this.props.questions[this.props.index_id].question_id;
        this.response.survey_id = this.props.survey.survey_id;
        this.response.response_id = this.props.survey_response.response_id;
        if(this.props.question_type === "CheckBox"){
            return(
                <div className="survey-option-input-box">
                    {
                        this.props.questions[this.props.index_id].options.map((option, id) => {
                            return(
                                <div>
                                    <input type="checkbox" className="option-"
                                           value={option.option_id}
                                           checked={this.getDefaultAnswer(question_id, option, question_types.CHECKBOX)}
                                           onChange={(event)=>{
                                               console.log(event.target.checked, id, question_id);
                                               this.response.check = event.target.checked;
                                               let res = this.findAnswer(question_id, option, question_types.CHECKBOX);
                                               if(res===null || res === undefined){
                                                   res = {
                                                       question : {
                                                           question_id : question_id
                                                       },
                                                       answer_id : uuidv4(),
                                                       answer_value : option.option_id
                                                   };
                                               }
                                               this.response.response_answer = res;
                                               this.sendSurveySaveRequest(this.response, question_types.CHECKBOX);
                                           }}
                                    /> {option.option_text}
                                </div>
                            )
                        })
                    }
                </div>);
        }
        else if(this.props.question_type === "RadioGroup"){
            return(
                <div className="survey-option-input-box">
                    {
                        this.props.questions[this.props.index_id].options.map((option, id) => {
                            return(
                                <div>
                                    <input type="radio" radioGroup={question_id} name={question_id}
                                           checked={this.getDefaultAnswer(question_id, option, question_types.RADIOGROUP)}
                                           defaultValue={option.option_id}
                                           onChange={(event)=>{
                                               console.log(event.target.checked, id, question_id, event.target.value);
                                               let res = this.findAnswer(question_id);
                                               if(res===null || res === undefined){
                                                   res = {
                                                       question : {
                                                           question_id : question_id
                                                       },
                                                       answer_id : uuidv4(),
                                                       answer_value : option.option_id
                                                   };
                                               }
                                               else {
                                                   res.answer_value = option.option_id
                                               }
                                               this.response.response_answer = res;
                                               this.sendSurveySaveRequest(this.response);
                                           }}
                                    />
                                    {option.option_text}
                                </div>
                            )
                        })
                    }
                </div>);
        }
        else if(this.props.question_type === "DropDown"){
            return(
                <div className="survey-option-input-box">
                    <select onChange={(event)=>{
                        //TODO: Put Check for Select
                        console.log(event.target.value, question_id);
                        let res = this.findAnswer(question_id);
                        if(res===null || res === undefined){
                            res = {
                                question : {
                                    question_id : question_id
                                },
                                answer_id : uuidv4(),
                                answer_value : event.target.value
                            };
                        }
                        else {
                            res.answer_value = event.target.value
                        }
                        this.response.response_answer = res;
                        this.sendSurveySaveRequest(this.response);
                    }}>
                        <option>Select</option>
                        {
                            this.props.questions[this.props.index_id].options.map((option, id) => {
                                let question_id = this.props.questions[this.props.index_id].question_id;
                                return(
                                    <option value={option.option_id}
                                            selected={this.getDefaultAnswer(question_id, option, question_types.DROPDOWN)}
                                    >
                                        {option.option_text}
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>);
        }
        else if(this.props.question_type === "YesNo"){
            return(
                <div className="survey-option-input-box">
                    <div>
                        <input type="radio" value="YES" name={this.props.questions[this.props.index_id].question_id}
                               checked={this.getDefaultAnswer(question_id, "YES", question_types.YESNO)}
                               onChange={(event)=>{
                                   let res = this.findAnswer(question_id);
                                   if(res===null || res === undefined){
                                       res = {
                                           question : {
                                               question_id : question_id
                                           },
                                           answer_id : uuidv4(),
                                           answer_value : event.target.value
                                       };
                                   }
                                   else {
                                       res.answer_value = event.target.value
                                   }
                                   this.response.response_answer = res;
                                   this.sendSurveySaveRequest(this.response);
                               }}
                        />
                        <label>YES</label>

                        <br/>

                        <input type="radio" value="NO"
                               name={this.props.questions[this.props.index_id].question_id}
                               checked={this.getDefaultAnswer(question_id, "NO", question_types.YESNO)}
                               onChange={(event)=>{
                                   let res = this.findAnswer(question_id);
                                   if(res===null || res === undefined){
                                       res = {
                                           question : {
                                               question_id : question_id
                                           },
                                           answer_id : uuidv4(),
                                           answer_value : event.target.value
                                       };
                                   }
                                   else {
                                       res.answer_value = event.target.value
                                   }
                                   this.response.response_answer = res;
                                   this.sendSurveySaveRequest(this.response);
                               }}
                        />
                        <label>NO</label>
                    </div>
                </div>
            );
        }
        else if(this.props.question_type === "ShortAnswer"){
            this.getDefaultAnswer(question_id, null, question_types.SHORTANSWER);
            return(
                <div className="survey-option-input-box" >
                    <div>
                        <input type="text"
                               value={this.getDefaultAnswer(question_id, null, question_types.SHORTANSWER)}
                               onBlur={(event)=>{
                                   console.log("On Blur: ", event.target.value);
                                   let res = this.findAnswer(question_id);
                                   if(res===null || res === undefined){
                                       res = {
                                           question : {
                                               question_id : question_id
                                           },
                                           answer_id : uuidv4(),
                                           answer_value : event.target.value
                                       };
                                   }
                                   else {
                                       res.answer_value = event.target.value
                                   }
                                   this.response.response_answer = res;
                                   this.sendSurveySaveRequest(this.response);
                               }}
                        />
                    </div>
                </div>
            );
        }
        else if(this.props.question_type === "DateTime"){
            return(
                <div className="survey-option-input-box">
                    <div>
                        <input type="date"
                               value={this.getDefaultAnswer(question_id, null, question_types.DATETIME)}
                               onChange={(event)=>{
                                   let res = this.findAnswer(question_id);
                                   if(res===null || res === undefined){
                                       res = {
                                           question : {
                                               question_id : question_id
                                           },
                                           answer_id : uuidv4(),
                                           answer_value : event.target.value
                                       };
                                   }
                                   else {
                                       res.answer_value = event.target.value
                                   }
                                   this.response.response_answer = res;
                                   this.sendSurveySaveRequest(this.response);
                               }}/>
                    </div>
                </div>
            );
        }
        else if(this.props.question_type === "StarRating"){
            return(
                <div className="survey-option-input-box">
                    {/*<div>*/}
                        {/*<input type="number"*/}
                               {/*value={this.getDefaultAnswer(question_id, null, question_types.STARRATING)}*/}
                               {/*onChange={(event)=>{*/}
                                   {/*let res = this.findAnswer(question_id);*/}
                                   {/*if(res===null || res === undefined){*/}
                                       {/*res = {*/}
                                           {/*question : {*/}
                                               {/*question_id : question_id*/}
                                           {/*},*/}
                                           {/*answer_id : uuidv4(),*/}
                                           {/*answer_value : event.target.value*/}
                                       {/*};*/}
                                   {/*}*/}
                                   {/*else {*/}
                                       {/*res.answer_value = event.target.value*/}
                                   {/*}*/}
                                   {/*this.response.response_answer = res;*/}
                                   {/*this.sendSurveySaveRequest(this.response);*/}
                       {/*}}/>*/}

                        {/*<div className="option-type-star">*/}
                            <StarRatingComponent
                                name="rate1"
                                starCount={5}
                                value={this.state.rating}
                                onStarClick={this.onStarClick.bind(this)}
                            />
                        {/*</div>*/}
                    {/*</div>*/}
                </div>);
        }
    }

    componentDidMount(){

    }

    componentWillUpdate(){
    }

    render() {
        // console.log("Question Index: ", this.props.index_id);
        // console.log("Question Type: ", this.props.question_type);
        // console.log("this.props.questions[this.props.index_id].options",this.props.questions[this.props.index_id].options)
        // console.log("Responses: ", JSON.stringify(this.props.survey_response));
        console.log("Responses: ", this.props.survey_response);
        // console.log("Questions: ",this.props.questions);
        return(
            <div className="QuestionComponent">
                <div className="survey-component_div">
                    <div className="survey-question-div">
                        <label className="survey-response-question-label">Question:</label>
                        {this.getQuestionView()}
                    </div>
                    <div className="survey-option-div">
                        {this.getOptionView()}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    console.log("mapstoprops Survey Response: ", state);
    return{
        survey: state.survey,
        questions: state.survey.questions,
        survey_response:state.survey_response
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            updateAnswer:updateAnswer,
            createSurveyResponse:createSurveyResponse
        }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(QuestionComponent));
