import React, {Component} from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity} from 'react-native';
import Modal from "react-native-modal";
import { Formik } from 'formik';
import * as Yup from 'yup'
import RepairsByCarComponent from '../RepairsByCarComponent'
import CarFormComponent from '../CarFormComponent'
import { Table, Row, Col } from 'react-native-table-component';
import { connect } from 'react-redux';
import {logoutUser} from '../redux/actions';

const queryFunctions = require('./graphQLQueriesForCars');

class CarsComponent extends Component {
    constructor(props){
      super(props);
      this.state = {
        cars: null,
        shouldGetPostData: false,
        shouldGetPutData: false,
        carIdUpdate: null,
        repairsForCar: null,
        repairCar: null,
        carForm: null,
        modalVisible: false
      }
    }
        
    async componentDidMount() {
        try {
            const cars = await queryFunctions.getCarsData();
            this.setState({ cars: cars })
        } catch(err) {
            if (err.message === "GraphQL error: Unauthorized") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message)
        }
    }
  
    callDeleteData = async(car) => {
        try {
            const deletedCarId = await queryFunctions.deleteData(car._id);
            const newCarsData = this.state.cars.filter(car => car._id !== deletedCarId);

            if (this.state.repairCarId === car._id) { //reset the repairs shown for the car if car is deleted
                this.setState({ 
                    repairsForCar: null,
                    cars: newCarsData
                });
            } else {
                this.setState({ cars: newCarsData });
            }

            if (this.props.subscribed) {
                queryFunctions.notifyCarChange("delete", car, this.props.phoneNumber)
            }
        } catch(err) {
            if (err.message === "GraphQL error: Unauthorized") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message)
        }
    }
  
    getPutData(car, setValues) {
      this.setState({
        shouldGetPutData: true,
        carIdUpdate: car._id
      });
      setValues({
        make: car.make,
        model: car.model,
        year: car.year,
        rating: car.rating
      });
    }
  
    callPutData = async(carId, values) => {
        try {
            const updatedCar = await queryFunctions.putData(carId, values)
            const newCarsData = this.state.cars.map((car) => {
                if (car._id === updatedCar._id) {
                    return updatedCar;
                } else {
                    return car;
                }
            })

            this.setState({
                cars: newCarsData,
                shouldGetPutData: false,
                carIdUpdate: null
            })

            if (this.props.subscribed) {
                queryFunctions.notifyCarChange("update", values, this.props.phoneNumber)
            }
        } catch(err) {
            if (err.message === "GraphQL error: Unauthorized") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message)
        }
    }
  
  
    getPostData(resetForm) {
        this.setState({shouldGetPostData: true});
        resetForm({
            make: "",
            model: "",
            year: "",
            rating: ""
        })
    }
  
    callPostData = async(values) => {
        try {
            const newCar = await queryFunctions.postData(values)
            var newCarsData = this.state.cars;
            newCarsData.push(newCar);

            this.setState({
                cars: newCarsData,
                shouldGetPostData: false,
            })

            if (this.props.subscribed) {
                queryFunctions.notifyCarChange("create", values, this.props.phoneNumber)
            }

        } catch(err) {
            if (err.message === "GraphQL error: Unauthorized") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message)
        }
    }

    setRepairsForCar = async(car) => {
        console.log(car)
        try {
            const repairsForCar = await queryFunctions.getRepairsForCar(car._id)
            this.setState({
                repairsForCar: repairsForCar,
                repairCar: car,
                modalVisible: true
            })
        } catch(err) {
            if (err.message === "GraphQL error: Unauthorized") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message)
        }
    }

    showRepairsForCar = () => {
        if (this.state.repairsForCar != null) {
            return (
                <Modal 
                    style={{
                        backgroundColor: 'white',
                        margin: 15,
                        flex: 0.7,
                        }}
                    isVisible={this.state.modalVisible}
                >
                    <View style={{flex: 1}}>
                        <View style={{flex:0.9, justifyContent: 'center'}}>
                            <RepairsByCarComponent repairsForCar={this.state.repairsForCar} repairCar={this.state.repairCar} rowColStyles={this.rowColStyles} tableStyles={this.tableStyles} />
                        </View>
                        <View style={{flex:0.1, justifyContent: 'flex-end'}}>
                            <TouchableOpacity style={{backgroundColor: '#57b0ff', justifyContent: 'center', flexDirection: 'row'}} onPress={() => this.setState({modalVisible: false})}>
                                <Text style={{color: 'white', fontSize: 19}}>Hide Repairs</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            );
        }
    }

    getNewCarButton = (resetForm) => {
        if (!(this.state.shouldGetPutData || this.state.shouldGetPostData)) {
            return (
                <View style={{marginHorizontal: 15}}>
                    <TouchableOpacity style={{backgroundColor: '#57b0ff', justifyContent: 'center', flexDirection: 'row'}} onPress={() => this.getPostData(resetForm)} >
                        <Text style={{color: 'white', fontSize: 22}}>NEW CAR</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
  
    getCarsDisplay = (props) => {
        if (this.state.shouldGetPostData) {
            return (<CarFormComponent queryFuncType={'graphql'} formikProps={props} shouldGetPutData={this.state.shouldGetPutData} shouldGetPostData={this.state.shouldGetPostData} cancel={() => {this.setState({shouldGetPostData: false})}} buttonText="SUBMIT" />);
        } else if (this.state.shouldGetPutData) {
            return (<CarFormComponent queryFuncType={'graphql'} formikProps={props} shouldGetPutData={this.state.shouldGetPutData} shouldGetPostData={this.state.shouldGetPostData} cancel={() => {this.setState({shouldGetPutData: false})}} buttonText="UPDATE" />);
        }
        var carsData = this.state.cars.map((car) => {
            return ( 
                <View style={{marginVertical: 10}}>
                    <Table>
                        <Row textStyle={{textAlign: 'center'}} data={['Year', car.year]} />
                        <Row textStyle={{textAlign: 'center'}} data={['Make', car.make]} />
                        <Row textStyle={{textAlign: 'center'}} data={['Model', car.model]} />
                        <Row textStyle={{textAlign: 'center'}} data={['Rating', car.rating]} />
                        <Row data={[
                            <TouchableOpacity style={{backgroundColor: '#57b0ff', justifyContent: 'center', flexDirection: 'row'}} onPress={() => this.getPutData(car, props.setValues)} >
                                <Text style={{color: 'white', fontSize: 16}}>EDIT</Text>
                            </TouchableOpacity>,
                            <TouchableOpacity style={{backgroundColor: '#57b0ff', justifyContent: 'center', flexDirection: 'row'}} onPress={() => this.setRepairsForCar(car)} >
                                <Text style={{color: 'white', fontSize: 16}}>SEE REPAIRS</Text>
                            </TouchableOpacity>,
                            <TouchableOpacity style={{backgroundColor: '#57b0ff', justifyContent: 'center', flexDirection: 'row'}} onPress={() => this.callDeleteData(car)} >
                                <Text style={{color: 'white', fontSize: 16}}>DELETE</Text>
                            </TouchableOpacity>
                            ]}
                        />
                    </Table>
                </View>
            )
        });
        return carsData.reverse();
    }
  
    handleCorrectSumbit = (values) => {
        if (this.state.shouldGetPostData) {
            this.callPostData(values);
        } else {
            this.callPutData(this.state.carIdUpdate, values);
        }
    }
  
    CarValidationSchema = Yup.object().shape({
      make: Yup.string()
        .required('Required'),
      model: Yup.string()
        .required('Required'),
      year: Yup.number()
        .integer('Must be an Integer')
        .min(1885, "Too Old!")
        .typeError('Must Be a Number')
        .required('Required'),
      rating: Yup.number()
        .typeError('Must be a Number')
        .integer('Must be an Integer')
        .min(0, 'Rating must be 0-10')
        .max(10, 'Rating must be 0-10')
        .required('Required')
    })
  
    render() {
        if (this.state.cars == null) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{color: 'black', fontSize: 25, fontWeight: 'bold'}}>Loading...</Text>
                </View>
            )
        }
        
        return(
            <View style={{flex: 1}}>
                <Formik
                initialValues = {{make: '', model: '', year: '', rating: ''}}
                validationSchema={this.CarValidationSchema}
                onSubmit = {(values) => {
                    this.handleCorrectSumbit(values)
                }}
                >
                {props => (
                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
                        <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                            <Text style={{fontSize: 20}}>Cars - GraphQL</Text>
                        </View>
                        <ScrollView 
                            contentInsetAdjustmentBehavior="automatic"
                            contentContainerStyle={{ marginHorizontal: 15}}>
                            {this.getCarsDisplay(props)}
                        </ScrollView>
                        {this.getNewCarButton(props.resetForm)}
                    </View>
                )}
                </Formik>
                {this.showRepairsForCar()}
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

export default connect(mapStateToProps, mapDispatchToProps)(CarsComponent);