import { Formik, Form } from 'formik';

import RepairFormComponent from '../RepairFormComponent'

import React, {Component} from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity} from 'react-native';
import * as Yup from 'yup'
import { Table, Row, Col } from 'react-native-table-component';

const queryFunctions = require('./graphQLQueriesForRepairs');
const queryFunctionsForCars = require('./graphQLQueriesForCars');
const subscriptions = require('./subscriptions');

import { connect } from 'react-redux';
import {logoutUser} from '../redux/actions';

import client from './apolloClient';

class RepairsComponent extends Component {
    constructor(props){
      super(props);
      this.state = {
        cars: null,
        mergedRepairs: null,
        shouldGetPostData: false,
        shouldGetPutData: false,
        repairUpdated: null
      }
    }
    
    async componentDidMount() {
        try{
            const repairs = await queryFunctions.getRepairsData();
            const cars = await queryFunctionsForCars.getCarsData();
            this.setState({ 
                mergedRepairs: repairs,
                cars: cars
            })

            client.subscribe(subscriptions.carCreatedSubscription).subscribe(res => {
                const newCars = [].concat(this.state.cars);
                newCars.push(res.data.carCreated);
                this.setState({cars: newCars})
            });

            client.subscribe(subscriptions.carUpdatedSubscription).subscribe(res => {
                var newRepairs = [].concat(this.state.mergedRepairs);
                newRepairs.forEach(repair => {
                    if (repair.car._id === res.data.carUpdated._id) {
                        repair.car = res.data.carUpdated;
                    }
                });

                const newCars = this.state.cars.map(car => {
                    if (car._id !== res.data.carUpdated._id) {
                        return car;
                    } else {
                        return res.data.carUpdated;
                    }
                })
                this.setState({mergedRepairs: newRepairs, cars: newCars})
            });

            client.subscribe(subscriptions.carRemovedSubscription).subscribe(res => {
                const deletedId = res.data.carRemoved
                const newRepairs = this.state.mergedRepairs.filter(repair => repair.car._id !== deletedId);
                const newCars = this.state.cars.filter(car => car._id !== deletedId);
                this.setState({mergedRepairs: newRepairs, cars: newCars})
            })

        } catch(err) {
            if (err.message === "GraphQL error: Unauthorized") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message);
        }
    }
    
    callDeleteData = async(repair) => {
        try {
            const deletedId = await queryFunctions.deleteData(repair._id);
            const newRepairs = this.state.mergedRepairs.filter(repair => repair._id !== deletedId);
            this.setState({mergedRepairs: newRepairs});

            if (this.props.subscribed) {
                queryFunctions.notifyRepairChange("delete", repair, repair.car, this.props.phoneNumber)
            }

        } catch(err) {
            if (err.message === "GraphQL error: Unauthorized") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message);
        }
    }
  
    getPutData(repair, setValues) {
        setValues({
            car_id: repair.car._id,
            description: repair.description,
            date: repair.date,
            cost: repair.cost,
            progress: repair.progress,
            technician: repair.technician
        });
        this.setState({
            shouldGetPutData: true,
            repairUpdated: repair
        });
    }
  
    callPutData = async(repairId, values) => {
        try {
            const updatedRepair = await queryFunctions.putData(repairId, values);
            const newRepairs = this.state.mergedRepairs.map((repair) => {
                if (repair._id === updatedRepair._id) {
                    return updatedRepair;
                }
                return repair;
            })
            this.setState({
                mergedRepairs: newRepairs, 
                shouldGetPutData: false,
                repairUpdated: null
            })

            if (this.props.subscribed) {
                queryFunctions.notifyRepairChange("delete", updatedRepair, updatedRepair.car, this.props.phoneNumber)
            }

        } catch(err) {
            if (err.message === "GraphQL error: Unauthorized") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message);
        }
    }
  
    getPostData(resetForm) {
        resetForm({
            car_id: "",
            description: "",
            date: "",
            cost: "",
            progress: "",
            technician: ""
        })
        this.setState({shouldGetPostData: true});
    }
  
    callPostData = async(values) => {
        try {
            const newRepair = await queryFunctions.postData(values);
            const newRepairs = [].concat(this.state.mergedRepairs);
            newRepairs.push(newRepair);
            this.setState({
                mergedRepairs: newRepairs, 
                shouldGetPostData: false
            })

            if (this.props.subscribed) {
                queryFunctions.notifyRepairChange("delete", newRepair, newRepair.car, this.props.phoneNumber)
            }
        } catch(err) {
            if (err.message === "GraphQL error: Unauthorized") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message);
        }
    }

    getRepairsDisplay = (props) => {
        if (this.state.shouldGetPutData) {
            return <RepairFormComponent cars={this.state.cars} visible={this.state.shouldGetPostData || this.state.shouldGetPutData} formikProps={props} submitText={"UPDATE"} cancel={() => this.setState({shouldGetPutData: false})} />
        } else if (this.state.shouldGetPostData) {
            return <RepairFormComponent cars={this.state.cars} visible={this.state.shouldGetPostData || this.state.shouldGetPutData} formikProps={props} submitText={"SUBMIT"} cancel={() => this.setState({shouldGetPostData: false})} />
        }
        var repairsDisplay = this.state.mergedRepairs.map((repair) => { 
            return (
                <View style={{marginVertical: 10}} >
                    <Table>
                        <Row textStyle={{textAlign: 'center'}} data={['Car', repair.car.year +" "+ repair.car.make +" "+ repair.car.model]} />
                        <Row textStyle={{textAlign: 'center'}} data={['Date Admitted', repair.date.split('T', 1)]} />
                        <Row textStyle={{textAlign: 'center'}} data={['Description', repair.description]} />
                        <Row textStyle={{textAlign: 'center'}} data={['Cost', repair.cost]} />
                        <Row textStyle={{textAlign: 'center'}} data={['Progress', repair.progress]} />
                        <Row textStyle={{textAlign: 'center'}} data={['Technician', repair.technician]} />
                        <Row data={[
                            <TouchableOpacity style={{backgroundColor: '#57b0ff', justifyContent: 'center', flexDirection: 'row'}} onPress={() => this.getPutData(repair, props.setValues)} >
                                <Text style={{color: 'white', fontSize: 16}}>EDIT</Text>
                            </TouchableOpacity>,
                            <TouchableOpacity style={{backgroundColor: '#57b0ff', justifyContent: 'center', flexDirection: 'row'}} onPress={() => this.callDeleteData(repair)} >
                                <Text style={{color: 'white', fontSize: 16}}>DELETE</Text>
                            </TouchableOpacity>
                            ]}
                        />
                    </Table>
                </View>
            )   
        });
        return repairsDisplay.reverse();
    }
  
    handleCorrectSumbit = (values) => {
      if (this.state.shouldGetPostData) {
        this.callPostData(values);
      } else {
        this.callPutData(this.state.repairUpdated._id, values);
      }
    }
  
    RepairValidationSchema = Yup.object().shape({
        car_id: Yup.string()
            .required('Required'),
        description: Yup.string()
            .required('Required'),
        date: Yup.date()
            .typeError('Must be a Date')
            .required('Required'),
        cost: Yup.number()
            .typeError('Must be a Number')
            .positive('Must be positive')
            .required('Required'),
        progress: Yup.string()
            .required('Required'),
        technician: Yup.string()
            .required('Required')
    })

    getNewRepairButton = (resetForm) => {
        if (!(this.state.shouldGetPostData || this.state.shouldGetPutData)) {
            return (
                <View style={{ marginHorizontal: 15 }} >
                    <TouchableOpacity style={{backgroundColor: '#57b0ff', justifyContent: 'center', flexDirection: 'row'}} onPress={() => this.getPostData(resetForm)} >
                        <Text style={{color: 'white', fontSize: 22}}>NEW REPAIR</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
  
    render() {
        if (this.state.mergedRepairs === null) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{color: 'black', fontSize: 25, fontWeight: 'bold'}}>Loading...</Text>
                </View>
            )
        }

        return(
            <View style={{flex: 1}}>
                <Formik
                initialValues = {{car_id: '', description: '', date: '', cost: '', progress: '', technician: ''}}
                validationSchema={this.RepairValidationSchema}
                onSubmit = {(values) => {
                    this.handleCorrectSumbit(values)
                }}
                >
                {props => (
                    <View style={{flex: 1, flexDirection: "column", justifyContent: 'space-between'}}>
                        <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                            <Text style={{fontSize: 20}}>Repairs - GraphQL</Text>
                        </View>
                        <ScrollView
                            contentInsetAdjustmentBehavior="automatic"
                            contentContainerStyle={{ marginHorizontal: 15}}>
                            {this.getRepairsDisplay(props)}
                        </ScrollView>
                        {this.getNewRepairButton(props.resetForm)}
                    </View>
                )}
                </Formik>
            </View>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        subscribed: state.subscribed,
        phoneNumber: state.phoneNumber
    }
}
const mapDispatchToProps = function(dispatch) {
    return {
        logoutUser: () => dispatch(logoutUser()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RepairsComponent);