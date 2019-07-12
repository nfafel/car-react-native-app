import React, {Component} from 'react';
import { View, Text, Button, TextInput, Picker } from 'react-native';
import { Row } from 'react-native-table-component';

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
            return <Picker.Item key="nullYears" value="" label="Loading..." />
        }

        var allYears = [<Picker.Item value="" key="selectYear" label="Select a Year" />];
        for (var i = this.state.yearsRange.max_year; i>=this.state.yearsRange.min_year; i--) {
            allYears.push(<Picker.Item key={""+i} value={i} label={""+i} />);
        }
        return allYears;
    }

    
    getMakeOptions = (values, setFieldValue) => {
        if (values.year === "") {
            return (<Picker.Item key="noYearChosen" value="" label="Select a Make" />, <Picker.Item value="" label="Select a Year to See Car Makes" />);
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
            return (<Picker.Item key="makesNull" value="" label="Loading..." />)
        }
        var allMakes;
        allMakes = this.state.allMakes.map((make) => {
            return (<Picker.Item key={""+make.make_id} value={make.make_id} label={""+make.make_display} />);
        })
        allMakes.splice(0,0, <Picker.Item key="selectMake" value="" label="Select a Make" />);
        return allMakes;
    }

    getModelOptions = (values, setFieldValue) => {
        if (values.make === "") {
            return (<Picker.Item key="noMakeChosen" value="" label="Select a Model" />, <Picker.Item value="" label="Select a Make to see Car Models" />);
        }

        if (this.state.newCarMake !== values.make) {
            if (!this.props.shouldGetPutData) {
                setFieldValue('model', "");
            }
            this.setState({newCarMake: values.make});
            
            queryFunctions.getAllCarModels(values.make, values.year)
                .then(res => this.setState({ allModels: res.Models }))
                .catch(err => alert(err));

        }

        if (this.state.allModels == null) {
            return (<Picker.Item key="modelsNull" value="" label="Loading..." />)
        }

        var allModels;
        allModels = this.state.allModels.map((model) => {
            return (<Picker.Item key={""+model.model_name} value={model.model_name} label={""+model.model_name} />);
        })
        allModels.splice(0,0, <Picker.Item key="selectModel" value="" label="Select a Model" />);
        return allModels;
    }
    

    render() {
        return (<Row key="newForm" data={[
            <Picker key="yearForm"
                onValueChange={this.props.formikProps.handleChange('year')}
                selectedValue={this.props.formikProps.values.year}
            >
                {this.getYearOptions()}
            </Picker>,
            <Picker key="makeForm"
                onValueChange={this.props.formikProps.handleChange('make')}
                selectedValue={this.props.formikProps.values.make}
            >
                {this.getMakeOptions(this.props.formikProps.values, this.props.formikProps.setFieldValue)}
            </Picker>,
            <Picker key="modelForm"
                onValueChange={this.props.formikProps.handleChange('model')}
                selectedValue={this.props.formikProps.values.model}
            >
                {this.getModelOptions(this.props.formikProps.values, this.props.formikProps.setFieldValue)}
            </Picker>,
            <View>
                <TextInput key="ratingForm"
                    onChangeText={this.props.formikProps.handleChange('rating')}
                    value={""+this.props.formikProps.values.rating}
                    placeholder="Rating"
                    keyboardType='numeric'
                />
            </View>,
            <View key="formButtons" >
                <Button onPress={this.props.cancel} title="CANCEL" />
                <Button onPress={this.props.formikProps.handleSubmit} title={this.props.buttonText} />
            </View>
        ]} />)
        
    }
}

export default CarFormComponent;