import { Formik, Form } from 'formik';

import RepairFormComponent from './RepairFormComponent'

import React, {Component} from 'react';
import { View, Text, Button, ScrollView} from 'react-native';
import * as Yup from 'yup'
import { Table, Row, Col } from 'react-native-table-component';


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
        repairIdUpdate: null
      }
    }
    
    async componentDidMount() {
        try {
            const carsResponse = await queryFunctions.getCarsData();
            const cars = carsResponse.cars;

            const repairsResponse = await queryFunctions.getRepairsData();
            const repairs = repairsResponse.repairs;

            var mergedRepairData = [];
            for (var i=0; i< repairs.length; i++) {
                var carForRepair = this.getCarForRepair(cars, repairs[i].car_id);
                mergedRepairData.push(new RepairWithCar(carForRepair, repairs[i]))
            }
            this.setState({
                mergedRepairs: mergedRepairData, 
                cars:cars
            });

        } catch(e) {
            console.error(e);
        }
    }

    getCarForRepair = (allCars, carId) => {
        for (var i = 0; i<allCars.length; i++) {
            if (allCars[i]._id === carId) {
                return allCars[i];
            }
        }
    }
    
    callDeleteData(repairId) {
        queryFunctions.deleteData(repairId)
            .then(res => {
                var mergedRepairData = [];
                for (var i=0; i< res.repairs.length; i++) {
                    var carForRepair = this.getCarForRepair(this.state.cars, res.repairs[i].car_id);
                    mergedRepairData.push(new RepairWithCar(carForRepair, res.repairs[i]))
                }
                this.setState({
                    mergedRepairs: mergedRepairData
                });
            })
            .catch(err => console.log(err));
    }
  
    getPutData(repair, setValues) {
        this.setState({
            shouldGetPutData: true,
            repairIdUpdate: repair._id
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
  
    callPutData(repairId, values) {
        queryFunctions.putData(repairId, values)
            .then(res => {
                var mergedRepairData = [];
                for (var i=0; i< res.repairs.length; i++) {
                    var carForRepair = this.getCarForRepair(this.state.cars, res.repairs[i].car_id);
                    mergedRepairData.push(new RepairWithCar(carForRepair, res.repairs[i]))
                }
                this.setState({
                    mergedRepairs: mergedRepairData, 
                    shouldGetPutData: false,
                    repairIdUpdate: null
                });
            })
            .catch(err => alert(err));
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
  
    callPostData(values) {
        queryFunctions.postData(values)
            .then(res => {
                var mergedRepairData = [];
                for (var i=0; i< res.repairs.length; i++) {
                    var carForRepair = this.getCarForRepair(this.state.cars, res.repairs[i].car_id);
                    mergedRepairData.push(new RepairWithCar(carForRepair, res.repairs[i]))
                }
                this.setState({
                    mergedRepairs: mergedRepairData, 
                    shouldGetPostData: false
                });
            })
            .catch(err => console.log(err));
    }
  
    tableStyles() {
        return ({
            
        });
    };
  
    rowColStyles() {
        return ({
           
        });
    };

    getRepairsDisplay = (props) => {
        var repairsDisplay = this.state.mergedRepairs.map((repair) => { 
            if (this.state.shouldGetPutData && repair._id === this.state.repairIdUpdate) {
                return (<RepairFormComponent cars={this.state.cars} formikProps={props} formType={"update"} cancel={() => this.setState({shouldGetPutData: false})} /> );
            } else if (this.state.shouldGetPostData || this.state.shouldGetPutData) {
                return (
                    <View style={{marginVertical: 10}} >
                        <Table>
                            <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Col textStyle={{textAlign: 'center'}} data={[
                                        'Car',
                                        'Date Admitted',
                                        'Description',
                                        'Cost',
                                        'Progress',
                                        'Technician'
                                    ]} 
                                /> 
                                <Col textStyle={{textAlign: 'center'}} data={[
                                        repair.car.year +" "+ repair.car.make +" "+ repair.car.model,
                                        repair.date.split('T', 1),
                                        repair.description,
                                        repair.cost,
                                        repair.progress,
                                        repair.technician,
                                    ]} 
                                />
                            </View>
                        </Table>
                    </View>
                )
            } else {
                return (
                    <View style={{marginVertical: 10}} >
                        <Table>
                            <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Col textStyle={{textAlign: 'center'}} data={[
                                        'Car',
                                        'Date Admitted',
                                        'Description',
                                        'Cost',
                                        'Progress',
                                        'Technician'
                                    ]} 
                                /> 
                                <Col textStyle={{textAlign: 'center'}} data={[
                                        repair.car.year +" "+ repair.car.make +" "+ repair.car.model,
                                        repair.date.split('T', 1),
                                        repair.description,
                                        repair.cost,
                                        repair.progress,
                                        repair.technician,
                                    ]} 
                                />
                            </View>
                            <View>
                                <Row data={[
                                    <Button title="EDIT" onPress={() => this.getPutData(repair, props.setValues)} />,
                                    <Button title="DELETE" onPress={() => this.callDeleteData(repair._id)} />
                                    ]}
                                />
                            </View>
                        </Table>
                    </View>
                )
            }
        });
        if (this.state.shouldGetPostData) {
            repairsDisplay.push(<RepairFormComponent cars={this.state.cars} formikProps={props} formType={"new"} cancel={() => this.setState({shouldGetPostData: false})} />);
        }
        return repairsDisplay;
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
                <View style={{position: 'absolute', bottom: 5, left:0, right:0, marginHorizontal: 20 }} >
                    <Button style={{flex:1}} title="NEW REPAIR" onPress={() => this.getPostData(resetForm)} />
                </View>
            )
        }
    }
  
    render() {
        if (this.state.cars == null || this.state.mergedRepairs == null) {
            return (<Text>Loading...</Text>)
        }
  
        return(
            <View>
                <Formik
                initialValues = {{car_id: '', description: '', date: '', cost: '', progress: '', technician: ''}}
                validationSchema={this.RepairValidationSchema}
                onSubmit = {(values) => {
                    this.handleCorrectSumbit(values)
                }}
                >
                {props => (
                    <View>
                        <ScrollView
                            contentInsetAdjustmentBehavior="automatic"
                            contentContainerStyle={{flexGrow:1, marginHorizontal: 15}}>
                            {this.getRepairsDisplay(props)}
                            <View style={{height: 40}}></View>
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