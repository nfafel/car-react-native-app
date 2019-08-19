import React, {Component} from 'react';
import { View, TouchableOpacity, Text, TextInput, KeyboardAvoidingView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {loginUser, setQueryType} from './redux/actions';
import { connect } from 'react-redux';
import { prepareLogin, login } from './Rest/restLoginFunc'
import { prepareGraphQLLogin, graphQLLogin } from './GraphQL/graphQLLoginFunc'
const jwtDecode = require('jwt-decode');

class LoginComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginForm: "open",
            confirmationForm: "closed",
            confirmationNumber: null,
            phoneNumber: null,
            token: null,
            incorrectGuesses: 0
        }
    }

    loginValidationSchema = () => {
        if (this.state.loginForm === "open") {
            return (
                Yup.object().shape({
                    phoneNumber: Yup.string()
                        .required('Required')
                        .matches(/^\([0-9]{3}\)-[0-9]{3}-[0-9]{4}$/, 'Required Format: (XXX)-XXX-XXXX'),
                    password: Yup.string()
                        .required('Required'),
                    queryType: Yup.string()
                        .required("Required"),
                })
            )
        } else {
            return (
                Yup.object().shape({
                    confirmationNumber: Yup.number()
                        .required("Requried")
                        .typeError('Must Enter a Number')
                })
            )
        }
    }

    circleStyles = {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ACACAC',
        alignItems: 'center',
        justifyContent: 'center',
    }

    checkedCircleStyles = {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#794F9B',
    } 

    resetLogin = async(resetForm) => {
        resetForm();
        this.setState({
            loginForm: "open",
            confirmationForm: "closed",
            confirmationNumber: null,
            phoneNumber: null,
            token: null,
            incorrectGuesses: 0
        });
    }

    getLoginForm = (props) => {
        var loginForm;
        if (this.state.loginForm === "open") {
            loginForm = (
                <View >
                    <Text style={{fontSize: 25, margin: 7, textAlign: "center"}}>Login</Text>
                    <KeyboardAvoidingView style={{marginHorizontal: 20, marginTop: 15, marginBottom: 10}}>
                        <View style={{ borderWidth: 0.5, borderRadius: 3, backgroundColor: "#f7f7f7" }} >
                            <TextInput 
                                keyboardType="phone-pad" 
                                placeholder="Phone Number"
                                onChangeText={props.handleChange('phoneNumber')}
                                value={props.values.phoneNumber}
                            />
                        </View>
                        {props.errors.phoneNumber &&
                            <Text style={{color: 'red'}}>{props.errors.phoneNumber}</Text>
                        }
                    </KeyboardAvoidingView>
                    <KeyboardAvoidingView style={{marginHorizontal: 20}}>
                        <View style={{borderWidth: 0.5, borderRadius: 3, backgroundColor: "#f7f7f7"}} >
                            <TextInput 
                                onChangeText={props.handleChange('password')}
                                value={props.values.password}
                                placeholder="Password" 
                                secureTextEntry
                            />
                        </View>
                        {props.errors.password &&
                            <Text style={{color: 'red'}}>{props.errors.password}</Text>
                        }
                    </KeyboardAvoidingView>
                    <View style={{marginTop: 10, flexDirection:"row", justifyContent: "center"}}>
                        <Text style={{marginRight: 5}}>Rest</Text>
                        <TouchableOpacity
                            style={this.circleStyles}
                            onPress={() => props.setFieldValue("queryType", "rest")} 
                        >
                            { props.values.queryType === "rest" && (<View style={this.checkedCircleStyles} />) }
                        </TouchableOpacity>
                        <Text style={{marginLeft: 20, marginRight: 5}}>GraphQL</Text>
                        <TouchableOpacity
                            style={this.circleStyles}
                            onPress={() => props.setFieldValue("queryType", "graphql")} 
                        >
                            { props.values.queryType === "graphql" && (<View style={this.checkedCircleStyles} />) }
                        </TouchableOpacity>
                    </View>
                    <View style={{marginHorizontal: 20, marginVertical: 10 }}>
                        <TouchableOpacity style={{backgroundColor: '#2595f7', borderRadius: 3, height: 40 }} onPress={() => props.submitForm()} >
                            <Text style={{flex: 1, textAlign: "center", textAlignVertical: "center", fontSize: 17, color: "white"}}>Next</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{flexDirection: "row", justifyContent: 'center'}} onPress={() => this.props.createAccount()}>
                        <Text style={{color: "blue"}} >Create an Account</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            loginForm = (
                <View >
                    <View style={{marginHorizontal: 20, marginVertical: 10, borderWidth: 0.5, borderRadius: 3}}>
                        <TextInput value={props.values.phoneNumber} editable={false} />
                    </View>
                    <View style={{marginHorizontal: 20, marginBottom: 10, borderWidth: 0.5, borderRadius: 3}}>
                        <TextInput secureTextEntry value={props.values.password} editable={false} />
                    </View>
                    <Text style={{textAlign: "center", fontSize: 20, marginTop: 15}} >Confirmation Number:</Text>
                    <KeyboardAvoidingView style={{marginVertical: 10, marginHorizontal: 20, borderWidth: 0.5, borderRadius: 3, backgroundColor: "#f7f7f7"}}>
                        <TextInput 
                            onChangeText={props.handleChange('confirmationNumber')}
                            value={props.values.confirmationNumber}
                            placeholder="Confirmation Number" 
                            keyboardType="number-pad"
                        />
                        {props.errors.password &&
                            <Text style={{color: 'red'}}>{props.errors.password}</Text>
                        }
                    </KeyboardAvoidingView>
                    <View style={{marginHorizontal: 40, marginTop: 10, flexDirection: "row", justifyContent: 'space-between'}}>
                        <TouchableOpacity style={{backgroundColor: '#d0d5db', height: 40, flex:1, borderRadius: 3, marginRight:5}} onPress={() => this.resetLogin(props.resetForm)}>
                            <Text style={{flex: 1, textAlign: "center", textAlignVertical: "center", fontSize: 17}}>Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: '#2595f7', height: 40, flex:1, borderRadius: 3, marginLeft: 5}} onPress={() => props.submitForm() } >
                            <Text style={{flex: 1, textAlign: "center", textAlignVertical: "center", fontSize: 17}}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } 
        return loginForm;
    }

    handleSubmit = (values) => {
        if (values.queryType === "rest") {
            if (this.state.loginForm === "open") {
                prepareLogin(values, this)
            } else {
                login(values, this)
            }
        } else {
            if (this.state.loginForm === "open") {
                prepareGraphQLLogin(values, this)
            } else {
                graphQLLogin(values, this)
            }
        }
    }

    render() {

        return (
            <View>
                <Formik
                    initialValues = {{phoneNumber: '', password: '', queryType: 'rest', confirmationNumber: ''}}
                    validationSchema={this.loginValidationSchema()}
                    onSubmit = {(values) => this.handleSubmit(values)}
                >
                    {(props) => 
                        this.getLoginForm(props)
                    }
                </Formik>
            </View>
        )
    }
}

const mapDispatchToProps = function(dispatch) {
    return {
        loginUser: (token) => {
            const decoded = jwtDecode(token);
            dispatch( loginUser({
                token: token, 
                subscribed: decoded.payload.subscribed,
                phoneNumber: decoded.payload.phoneNumber
            }))
        },
        setQueryType: queryType => dispatch(setQueryType({queryType: queryType}))
    }
}
  
export default connect(null, mapDispatchToProps)(LoginComponent);