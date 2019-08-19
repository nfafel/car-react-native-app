import { Formik, Form } from 'formik';

import RepairFormComponent from '../RepairFormComponent'

import React, {Component} from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity} from 'react-native';
import * as Yup from 'yup'
import { Table, Row, Col } from 'react-native-table-component';

const queryFunctions = require('./graphQLQueriesForRepairs');
const queryFunctionsForCars = require('./graphQLQueriesForCars');

class RepairsComponent extends Component {
    constructor(props){
      super(props);
      this.state = {
        cars: null,
        repairs: null,
        shouldGetPostData: false,
        shouldGetPutData: false,
        repairIdUpdate: null
      }
    }
    
    componentDidMount() {
        queryFunctions.getRepairsData()
            .then(res => this.setState({repairs: res}) )
            .catch(err => console.log(err))

        // queryFunctions.subscribeToRepairsData(this)
        //     .catch(err => console.log(err))
    }
    
    callDeleteData(repairId) {
        queryFunctions.deleteData(repairId)
            .then(res => this.setState({repairs: res}) )
            .catch(err => console.log(err));
    }
  
    getPutData(repair, setValues) {
        queryFunctionsForCars.getCarsData()
            .then(res => this.setState({
                cars: res,
                shouldGetPutData: true,
                repairIdUpdate: repair._id
            }))
            .catch(err => console.log(err))
        setValues({
            car_id: repair.car._id,
            description: repair.description,
            date: repair.date,
            cost: repair.cost,
            progress: repair.progress,
            technician: repair.technician
        });
    }
  
    callPutData(repairId, values) {
        queryFunctions.putData(repairId, values)
            .then(res => this.setState({
                    repairs: res, 
                    shouldGetPutData: false,
                    repairIdUpdate: null
                }))
            .catch(err => alert(err));
    }
  
    getPostData(resetForm) {
        queryFunctionsForCars.getCarsData()
            .then(res => this.setState({
                cars: res,
                shouldGetPostData: true,
            }))
            .catch(err => console.log(err))
        resetForm({
            car_id: "",
            description: "",
            date: "",
            cost: "",
            progress: "",
            technician: ""
        })
    }
  
    callPostData(values) {
        queryFunctions.postData(values)
            .then(res => this.setState({
                    repairs: res, 
                    shouldGetPostData: false
                }))
            .catch(err => console.log(err));
    }

    getRepairsDisplay = (props) => {
        if (this.state.shouldGetPutData) {
            return <RepairFormComponent cars={this.state.cars} visible={this.state.shouldGetPostData || this.state.shouldGetPutData} formikProps={props} submitText={"UPDATE"} cancel={() => this.setState({shouldGetPutData: false})} />
        } else if (this.state.shouldGetPostData) {
            return <RepairFormComponent cars={this.state.cars} visible={this.state.shouldGetPostData || this.state.shouldGetPutData} formikProps={props} submitText={"SUBMIT"} cancel={() => this.setState({shouldGetPostData: false})} />
        }
        var repairsDisplay = this.state.repairs.map((repair) => { 
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
                            <TouchableOpacity style={{backgroundColor: '#57b0ff', justifyContent: 'center', flexDirection: 'row'}} onPress={() => this.callDeleteData(repair._id)} >
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
        this.callPutData(this.state.repairIdUpdate, values);
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
        if (this.state.repairs == null) {
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
  
  export default RepairsComponent;