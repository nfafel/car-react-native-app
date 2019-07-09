import { Field, ErrorMessage } from 'formik';
import React, {Component} from 'react';
import { View, Text, Button, ScrollView, TextInput, Picker } from 'react-native';
import { Formik } from 'formik';
import { Table, Row, Rows } from 'react-native-table-component';

const queryFunctions = require('./queryFuncForCarsComponent');

class CarFormComponent extends Component {
    
    constructor(props){
      super(props);
      this.state = {
        yearsRange: null, 
        allMakes: null,
        allModels: null,
        newCarYear: null,
        newCarMake: null
      }
    }

    componentDidMount() {
        queryFunctions.getAllCarYears()
            .then(res => this.setState({ yearsRange: res.Years }))
            .catch(err => alert(err));
    }

    getYearOptions = () => {
        if (this.state.yearsRange == null) {
            return <Picker.Item value="" label="Loading..." />
        }

        var allYears = [<Picker.Item value="" label="Select a Year" />];
        for (var i = this.state.yearsRange.max_year; i>=this.state.yearsRange.min_year; i--) {
            allYears.push(<Picker.Item value={i} label={""+i} />);
        }
        return allYears;
    }

    
    getMakeOptions = (values, setFieldValue) => {
        if (values.year === "") {
            return (<Picker.Item value="" label="Select a Make" />, <Picker.Item value="" label="Select a Year to See Car Makes" />);
        }

        if (this.state.newCarYear !== values.year) {
            if (!this.props.shouldGetPutData) {
                setFieldValue('make', "");
            }
            this.setState( {newCarYear: values.year} );
            queryFunctions.getAllCarMakes(values.year)
                .then(res => this.setState({ allMakes: res.Makes }))
                .catch(err => alert(err)); 
        }
        if (this.state.allMakes == null ) {
            return (<Picker.Item value="" label="Loading..." />)
        }
        var allMakes;
        allMakes = this.state.allMakes.map((make) => {
            return (<Picker.Item value={make.make_id} label={""+make.make_display} />);
        })
        allMakes.splice(0,0, <Picker.Item value="" label="Select a Make" />);
        return allMakes;
    }

    getModelOptions = (values, setFieldValue) => {
        if (values.make === "") {
        return (<Picker.Item value="" label="Select a Model" />, <Picker.Item value="" label="Select a Make to see Car Models" />);
        }

        if (this.state.newCarMake !== values.make) {
            if (!this.props.shouldGetPutData) {
                setFieldValue('model', "");
            }
            this.setState( {newCarMake: values.make} );
            
            queryFunctions.getAllCarModels(values.make, values.year)
                .then(res => this.setState({ allModels: res.Models }))
                .catch(err => alert(err));

        }

        if (this.state.allModels == null) {
            return (<Picker.Item value="" label="Loading..." />)
        }

        var allModels;
        allModels = this.state.allModels.map((model) => {
            return (<Picker.Item value={model.model_name} label={""+model.model_name} />);
        })
        allModels.splice(0,0, <Picker.Item value="" label="Select a Model" />);
        return allModels;
    }
    

    render() {
        alert(this.props.formikProps.values.year + " " + this.props.formikProps.values.make + " " + this.props.formikProps.values.model + "  " + this.props.formikProps.values.rating)

        return (<Row data={[
            <Picker
                onValueChange={this.props.formikProps.handleChange('year')}
                selectedValue={this.props.formikProps.values.year}
            >
                {this.getYearOptions()}
            </Picker>,
            <Picker
                onValueChange={this.props.formikProps.handleChange('make')}
                selectedValue={this.props.formikProps.values.make}
            >
                {this.getMakeOptions(this.props.formikProps.values, this.props.formikProps.setFieldValue)}
            </Picker>,
            <Picker
                onValueChange={this.props.formikProps.handleChange('model')}
                selectedValue={this.props.formikProps.values.model}
            >
                {this.getModelOptions(this.props.formikProps.values, this.props.formikProps.setFieldValue)}
            </Picker>,
            <TextInput
                onValueChange={this.props.formikProps.handleChange('rating')}
                value={this.props.formikProps.values.rating}
                placeholder="Rating"
            />,
            <View>
                <Button onPress={this.props.cancel} title="CANCEL" />
                <Button onPres={this.props.formikProps.handleSubmit} title="SUBMIT" />
            </View>
        ]} />)
        
    }
}

export default CarFormComponent;