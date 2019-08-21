import React, {Component} from 'react';
import { View, TouchableOpacity, Text, TextInput, KeyboardAvoidingView } from 'react-native';
import { Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import {loginUser} from './redux/actions';

class RegistrationComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            registrationForm: "open",
            confirmationForm: "closed",
            confirmationNumber: null,
            phoneNumber: null,
            incorrectGuesses: 0
        }
    }

    registrationValidationSchema = () => {
        if (this.state.registrationForm === "open") {
            return (
                Yup.object().shape({
                    phoneNumber: Yup.string()
                        .required('Required')
                        .matches(/^\([0-9]{3}\)-[0-9]{3}-[0-9]{4}$/, 'Required Format: (XXX)-XXX-XXXX'),
                }) 
            )
        } 

        return (
            Yup.object().shape({
                phoneNumber: Yup.string()
                    .required('Required')
                    .matches(/^\([0-9]{3}\)-[0-9]{3}-[0-9]{4}$/, 'Required Format: (XXX)-XXX-XXXX'),
                confirmationNumber: Yup.number()
                    .required('Required')
                    .typeError('Must Enter a Number'),
                password: Yup.string()
                    .required('Required'),
                confirmPassword: Yup.string()
                    .required('Required')
                    .oneOf([Yup.ref('password'), null], "Passwords Don't Match")
            }) 
        )
    }

    checkAvailability = async(phoneNumber) => {
        var parsedNumber = phoneNumber.replace(/-|\(|\)/g, "");
        parsedNumber = "1" + parsedNumber
        const availabilityResponse = await fetch(`https://tranquil-caverns-41069.herokuapp.com/users/${parsedNumber}/availability`)
        const body = await availabilityResponse.json();

        if (body.available) {
            this.sendConfirmation(parsedNumber);
        } else {
            alert("An account already exists under the entered phone number.")
        }
    }

    sendConfirmation = (parsedNumber) => {
        var confirmationNumber = Math.floor(Math.random() * 900000) + 100000;
        this.setState({
            confirmationNumber: confirmationNumber,
            phoneNumber: parsedNumber,
            registrationForm: "closed",
            confirmationForm: "open"
        })
        fetch(`https://tranquil-caverns-41069.herokuapp.com/sms/${parsedNumber}/sendConfirmation`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                confirmationNumber: confirmationNumber.toString()
            })
        });
    }

    confirmRegistration = async(values) => {
        if (parseInt(values.confirmationNumber) === this.state.confirmationNumber) {
            const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/users`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumber: this.state.phoneNumber,
                    password: values.password,
                    subscribed: false
                })
            });
            const body = await response.json();
            this.props.loginUser(body.token);
            this.props.cancel();
        } else {
            if (this.state.incorrectGuesses < 2) {
                alert("The confirmation number you provided is incorrect. Please try again.")
                this.setState({
                    incorrectGuesses: this.state.incorrectGuesses+1
                })
            } else {
                alert("You have provided the confirmation number incorrectly too many times. If you would still like to subscribe, please try again.")
                this.setState({
                    incorrectGuesses: 0,
                    SMSConfirmationForm: "closed"
                })
            }
        }
    }

    getFormFields = (props) => {
        if (this.state.registrationForm === 'open') {
            return (
                <View style={{marginHorizontal: 20}}>
                    <Text style={{fontSize: 25, margin: 12, textAlign: "center"}}>Sign Up</Text>
                    <Text style={{fontSize: 17, textAlign: "center"}}>Enter your phone number below.</Text>
                    <Text style={{fontSize: 17, textAlign: "center"}}>It will act as your username.</Text>
                    <KeyboardAvoidingView>
                        <View style={{flexDirection: "column", justifyContent: "center", marginTop: 15, borderWidth: 0.5, borderRadius: 3, backgroundColor: "#f7f7f7", height: 50 }} >
                            <TextInput 
                                keyboardType="phone-pad" 
                                placeholder="Phone Number"
                                onChangeText={props.handleChange('phoneNumber')}
                                value={props.values.phoneNumber}
                                style={{marginLeft: 5}}
                            />
                        </View>
                        {props.errors.phoneNumber &&
                            <Text style={{color: 'red'}}>{props.errors.phoneNumber}</Text>
                        }
                    </KeyboardAvoidingView>
                </View>
            )
        } else {
            return (
                <View style={{marginHorizontal: 20}}>
                    <View style={{flexDirection: "column", justifyContent: "center", borderWidth: 0.5, borderRadius: 3, marginTop: 30, height: 50}}>
                        <TextInput value={props.values.phoneNumber} editable={false} style={{flexDirection: "column", justifyContent: "center", marginLeft: 5}}/>
                    </View>

                    <Text style={{textAlign: "center", marginTop: 10}}>Enter the confirmation number sent to the number above and choose a password:</Text>
                    <View style={{flexDirection: "column", justifyContent: "center", marginTop: 10, borderWidth: 0.5, borderRadius: 3, backgroundColor: "#f7f7f7", height: 50 }} >
                        <TextInput 
                            keyboardType="number-pad" 
                            placeholder="Confirmation Number"
                            onChangeText={props.handleChange('confirmationNumber')}
                            value={props.values.confirmationNumber}
                            style={{marginLeft: 5}}
                        />
                    </View>
                    {props.errors.confirmationNumber &&
                        <Text style={{color: 'red'}}>{props.errors.confirmationNumber}</Text>
                    }

                    <View style={{flexDirection: "column", justifyContent: "center", marginTop: 10, borderWidth: 0.5, borderRadius: 3, backgroundColor: "#f7f7f7", height: 50 }} >
                        <TextInput 
                            secureTextEntry
                            placeholder="Password"
                            onChangeText={props.handleChange('password')}
                            value={props.values.password}
                            style={{marginLeft: 5}}
                        />
                    </View>
                    {props.errors.password &&
                        <Text style={{color: 'red'}}>{props.errors.password}</Text>
                    }

                    <View style={{flexDirection: "column", justifyContent: "center", marginTop: 15, borderWidth: 0.5, borderRadius: 3, backgroundColor: "#f7f7f7", height: 50 }} >
                        <TextInput 
                            secureTextEntry 
                            placeholder="Confirm Password"
                            onChangeText={props.handleChange('confirmPassword')}
                            value={props.values.confirmPassword}
                            style={{marginLeft: 5}}
                        />
                    </View>
                    {props.errors.confirmPassword &&
                        <Text style={{color: 'red'}}>{props.errors.confirmPassword}</Text>
                    }
                </View>
            )
        }
    }

    handleSubmit = (values) => {
        if (this.state.registrationForm === 'open') {
            this.checkAvailability(values.phoneNumber);
        } else {
            this.confirmRegistration(values)
        }
    }

    render() {

        return (
            <View>
                <Formik
                    initialValues = {{phoneNumber: '', confirmationNumber: '', password: '', confirmPassword: ''}}
                    validationSchema={this.registrationValidationSchema()}
                    onSubmit = {(values) => this.handleSubmit(values)}
                >
                {(props) => (
                    <View>
                        {this.getFormFields(props)}
                        <View style={{marginHorizontal: 40, marginTop: 20, flexDirection: "row", justifyContent: "center"}}>
                            <TouchableOpacity onPress={() => this.props.cancel()} style={{flex: 1, flexDirection: "column", justifyContent: "center", backgroundColor: '#d0d5db', height: 40, borderRadius: 3, marginRight:5}}>
                                <View>
                                    <Text style={{textAlign: "center", fontSize: 17 }}>Cancel</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => props.submitForm()} style={{flex:1, flexDirection: "column", justifyContent: "center", backgroundColor: '#2595f7', height: 40, borderRadius: 3, marginRight:5}}>
                                <View>
                                    <Text style={{textAlign: "center", fontSize: 17}}>
                                        {(this.state.confirmationForm === 'open') ? ("Register") : ("Next")}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                </Formik>
            </View>
        )
    }
}

const mapDispatchToProps = function(dispatch) {
    return {
        loginUser: token => dispatch(loginUser({token: token}))
    }
}

export default connect(null, mapDispatchToProps)(RegistrationComponent);