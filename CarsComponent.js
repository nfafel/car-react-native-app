import React, {Component} from 'react';
import { View, Text, Button, ScrollView, TextInput } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup'
//import RepairsByCarComponent from './RepairsByCarComponent'

import CarFormComponent from './CarFormComponent'

import { Table, Row, Rows } from 'react-native-table-component';

const queryFunctions = require('./queryFuncForCarsComponent')

class CarsComponent extends Component {
    constructor(props){
      super(props);
      this.state = {
        cars: null,
        shouldGetPostData: false,
        shouldGetPutData: false,
        carIdUpdate: null,
        repairsForCar: null,
        repairCarId: null,
        repairCarMake: null,
        repairCarModel: null,
        repairCarYear: null,
        carForm: null,
      }
    }
    
    componentDidMount() {
        
        queryFunctions.getCarsData()
            .then(res => this.setState({ cars: res.cars }))
            .catch(err => console.log(err));
    }
  
    callDeleteData(carId) {
        queryFunctions.deleteData(carId)
            .then(res => this.setState({cars: res.cars}))
            .catch(err => console.log(err));

        queryFunctions.deleteRepairsWithCar(carId)
            .catch(err => console.log(err));

        if (this.state.repairCarId === carId) {
            this.setState( {repairsForCar: null} );
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
  
    callPutData(carId, values) {
        queryFunctions.putData(carId, values)
            .then(res => this.setState({ 
                cars: res.cars,
                shouldGetPostData: false,
                shouldGetPutData: false,
                carIdUpdate: null
            }))
            .catch(err => console.log(err));
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
  
    callPostData(values) {
        queryFunctions.postData(values)
            .then(res => this.setState({ 
                cars: res.cars,
                shouldGetPostData: false,
                shouldGetPutData: false,
                carIdUpdate: null,
            }))
            .catch(err => console.log(err));
    }

    setRepairsForCar = (repairCarId, repairCarMake, repairCarModel, repairCarYear) => {
        queryFunctions.getRepairsForCar(repairCarId)
            .then(res => this.setState({ 
                repairsForCar: res.repairsForCar,
                repairCarId: repairCarId,
                repairCarMake: repairCarMake,
                repairCarModel: repairCarModel,
                repairCarYear: repairCarYear
            }))
            .catch(err => console.log(err));
    }

    showRepairsForCar = () => {
        if (this.state.repairsForCar != null) {
            return (<RepairsByCarComponent repairsForCar={this.state.repairsForCar} repairCarMake={this.state.repairCarMake} repairCarModel={this.state.repairCarModel} repairCarYear={this.state.repairCarYear} rowColStyles={this.rowColStyles} tableStyles={this.tableStyles} />);
        } 
    }

    getNewCarButton = (resetForm) => {
        if (!(this.state.shouldGetPutData || this.state.shouldGetPostData)) {
            return (<Button title="NEW CAR" onPress={() => this.getPostData(resetForm)} />)
        }
    }
  
    tableStyles = {
        "width": "90%",
     
    };

    rowColStyles = {
        
     
    };
  
    getCarsDisplay = (props) => {
        var carsData = this.state.cars.map((car) => {
            if (this.state.shouldGetPutData && car._id === this.state.carIdUpdate) {
                return (<CarFormComponent formikProps={props} shouldGetPutData={this.state.shouldGetPutData} cancel={() => {this.setState({shouldGetPutData: false})}} buttonText={"UPDATE"} />);
                
            } else if (this.state.shouldGetPostData || this.state.shouldGetPutData) {
                return (
                    <Row data={[
                        <Text>{car.year}</Text>, 
                        <Text>{car.make}</Text>,
                        <Text>{car.model}</Text>, 
                        <Text>{car.rating}</Text>
                    ]} />
                )
            } else {
                return ( <Row data={[
                    <Text>{car.year}</Text>, 
                    <Text>{car.make}</Text>, 
                    <Text>{car.model}</Text>, 
                    <Text>{car.rating}</Text>, 
                    <View>
                        <Button title="EDIT" onPress={() => this.getPutData(car, props.setValues)} />
                        <Button title="SEE REPAIRS" onPress={() => this.setRepairsForCar(car._id, car.make, car.model, car.year)} />
                        <Button title="DELETE" onPress={() => this.callDeleteData(car._id)} />
                    </View>
                ]} />)
            }
        });
        if (this.state.shouldGetPostData) {
            carsData.push(<CarFormComponent formikProps={props} shouldGetPutData={this.state.shouldGetPutData} cancel={() => {this.setState({shouldGetPostData: false})}} buttonText={"NEW CAR"} />);
        }
        return (carsData);
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
            <ScrollView>
                <Formik
                initialValues = {{make: '', model: '', year: '', rating: ''}}
                validationSchema={this.CarValidationSchema}
                onSubmit = {(values) => {
                    this.handleCorrectSumbit(values)
                }}
                >
                {props => (
                <View>
                    <Table style={this.tableStyles}>
                        <Row style={this.rowColStyles} data={['Year', 'Make', 'Model', 'Rating', 'Actions']}/> 
                        {this.getCarsDisplay(props)}
                    </Table>
                    {this.getNewCarButton(props.resetForm)}
                </View>
                )}
                </Formik>
                {this.showRepairsForCar()}
            </ScrollView>
      );
    }
}
  
export default CarsComponent;


