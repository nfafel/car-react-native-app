import { Formik, Form } from 'formik';

import RepairFormComponent from '../RepairFormComponent'

import React, {Component} from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity} from 'react-native';
import * as Yup from 'yup'
import { Table, Row, Col } from 'react-native-table-component';
import { withNavigation } from "react-navigation";
import { connect } from 'react-redux';
import {logoutUser} from '../redux/actions';

const queryFunctions = require('./queryFuncForRepairsComponent');

class RepairWithCar {
    constructor(car, repair) {
        this.car = car;
        this._id = repair._id;
        this.description = repair.description;
        this.cost = repair.cost;
        this.date = repair.date;
        this.progress = repair.progress;
        this.technician = repair.technician;
    }
}

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
    
    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", async() => {
            try {
                const cars = await queryFunctions.getCarsData(this.props.token);
                const repairs = await queryFunctions.getRepairsData(this.props.token);
                var mergedRepairData = [];
                for (var i=0; i< repairs.length; i++) {
                    var carForRepair = this.getCarForRepair(cars, repairs[i].car_id);
                    mergedRepairData.push(new RepairWithCar(carForRepair, repairs[i]))
                }
                this.setState({
                    mergedRepairs: mergedRepairData, 
                    cars:cars
                });
    
            } catch(err) {
                if (err.statusCode === 401) {
                    this.props.logoutUser();
                    setTimeout(() => alert("You have been automatically logged out. Please login in again."))
                }
                console.log(err.message)
            }
        });
    }

    getCarForRepair = (allCars, carId) => {
        for (var i = 0; i<allCars.length; i++) {
            if (allCars[i]._id === carId) {
                return allCars[i];
            }
        }
    }
    
    callDeleteData = async(repair) => {
        try {
            const deletedRepairId = await queryFunctions.deleteData(repair._id, this.props.token);
            const newMergedRepairs = this.state.mergedRepairs.filter(repair => repair._id !== deletedRepairId);

            this.setState({ mergedRepairs: newMergedRepairs});

            if (this.props.subscribed) {
                queryFunctions.notifyRepairChange("delete", repair, repair.car, this.props.phoneNumber)
            }

        } catch(err) {
            if (err.statusCode === 401) {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message)
        }   
    }
  
    getPutData(repair, setValues) {
        this.setState({
            shouldGetPutData: true,
            repairUpdated: repair
        });
        setValues({
            car_id: repair.car._id,
            description: repair.description,
            date: repair.date,
            cost: repair.cost,
            progress: repair.progress,
            technician: repair.technician
        });
    }
  
    callPutData = async(repair, values) => {
        try {
            const updatedRepair = await queryFunctions.putData(repair._id, values, this.props.token);
            const carForRepair = this.getCarForRepair(this.state.cars, updatedRepair.car_id)
            const mergedRepair = new RepairWithCar(carForRepair, updatedRepair);

            const newMergedRepairs = this.state.mergedRepairs.map((repair) => {
                if (repair._id === updatedRepair._id) {
                    return mergedRepair;
                } else {
                    return repair;
                }
            })
            this.setState({
                mergedRepairs: newMergedRepairs, 
                shouldGetPutData: false,
                repairUpdated: null
            });

            if (this.props.subscribed) {
                queryFunctions.notifyRepairChange("update", values, carForRepair, this.props.phoneNumber)
            }
        } catch(err) {
            if (err.statusCode === 401) {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message)
        }
    }
  
    getPostData(resetForm) {
      this.setState({shouldGetPostData: true});
      resetForm({
        car_id: "",
        description: "",
        date: "",
        cost: "",
        progress: "",
        technician: ""
      })
    }
  
    callPostData = async(values) => {
        try {
            const newRepair = await queryFunctions.postData(values, this.props.token);
            const carForRepair = this.getCarForRepair(this.state.cars, newRepair.car_id)
            const mergedRepair = new RepairWithCar(carForRepair, newRepair);
            
            const newMergedRepairs = this.state.mergedRepairs;
            newMergedRepairs.push(mergedRepair);

            this.setState({
                mergedRepairs: newMergedRepairs, 
                shouldGetPostData: false
            });

            if (this.props.subscribed) {
                queryFunctions.notifyRepairChange("create", values, carForRepair, this.props.phoneNumber)
            }
        } catch(err) {
            if (err.statusCode === 401) {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message)
        }
    }

    getRepairsDisplay = (props) => {
        if (this.state.shouldGetPutData) {
            return <RepairFormComponent cars={this.state.cars}  formikProps={props} submitText={"UPDATE"} cancel={() => this.setState({shouldGetPutData: false})} />;
        } else if (this.state.shouldGetPostData) {
            return <RepairFormComponent cars={this.state.cars} formikProps={props} submitText={"Submit"} cancel={() => this.setState({shouldGetPostData: false})} />;
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
        this.callPutData(this.state.repairUpdated, values);
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
  
    render() {
        if (this.state.cars == null || this.state.mergedRepairs == null) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{color: 'black', fontSize: 25, fontWeight: 'bold'}}>Loading...</Text>
                </View>
            )
        }
  
        return(
            <View style={{flex: 1}}>
                <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                    <Text style={{fontSize: 20}}>Repairs - REST</Text>
                </View>
                <Formik
                    initialValues = {{car_id: '', description: '', date: '', cost: '', progress: '', technician: ''}}
                    validationSchema={this.RepairValidationSchema}
                    onSubmit = {(values) => {
                        this.handleCorrectSumbit(values)
                    }}
                >
                    {props => (
                        <View style={{flex: 1, flexDirection: "column", justifyContent: 'space-between'}}>
                            <ScrollView
                                contentInsetAdjustmentBehavior="automatic"
                                contentContainerStyle={{ marginHorizontal: 15}}>
                                {this.getRepairsDisplay(props)}
                            </ScrollView>
                            <View style={{ marginHorizontal: 15 }} >
                                <TouchableOpacity style={{backgroundColor: '#57b0ff', justifyContent: 'center', flexDirection: 'row'}} onPress={() => this.getPostData(props.resetForm)} >
                                    <Text style={{color: 'white', fontSize: 22}}>NEW REPAIR</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Formik>
            </View>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        token: state.token,
        subscribed: state.subscribed,
        phoneNumber: state.phoneNumber
    }
}
const mapDispatchToProps = function(dispatch) {
    return {
        logoutUser: () => dispatch(logoutUser()),
    }
}
  
export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(RepairsComponent));