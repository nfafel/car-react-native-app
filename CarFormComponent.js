import React, {Component} from 'react';
import { View, Text, Button, TextInput, Picker, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Row, Col } from 'react-native-table-component';
import Modal from "react-native-modal";

const restQueryFunctions = require('./queryFuncForCarsComponent');
const graphqlQueryFunctions = require('./graphQLQueriesForCars');

class CarFormComponent extends Component {
    
    constructor(props){
      super(props);
      this.state = {
        yearsRange: null, 
        allMakes: null,
        allModels: null,
        newCarYear: props.formikProps.values.year,
        newCarMake: props.formikProps.values.make,
        visible: false
      }
      this.queryFunctions = (this.props.queryType == "rest") ? restQueryFunctions : graphqlQueryFunctions;
    }

    componentDidMount() {
        queryFunctions.getAllCarYears()
            .then(res => this.setState({ yearsRange: res }))
            .catch(err => console.log(err));

        if (this.state.newCarYear != "") {
            queryFunctions.getAllCarMakes(this.state.newCarYear)
                .then(res => this.setState({ allMakes: res }))
                .catch(err => console.log(err));

            queryFunctions.getAllCarModels(this.state.newCarMake, this.state.newCarYear)
                .then(res => this.setState({ allModels: res }))
                .catch(err => console.log(err));
        }
    }

    getYearOptions = () => {
        if (this.state.yearsRange == null) {
            return [
                <Picker.Item key="nullYears" value="" label="Loading..." />,
            ]
        }
        
        var allYears = [<Picker.Item value="" key="selectYear" label="Select a Year" />];
        for (var i = this.state.yearsRange.max_year; i>=this.state.yearsRange.min_year; i--) {
            allYears.push(<Picker.Item key={""+i} value={i} label={""+i} />);
        }
        return allYears;
    }

    
    getMakeOptions = () => {
        if (this.props.formikProps.values.year === "") {
            return <Picker.Item value="" label="No Year Chosen" />;
            
        }
        if (this.state.allMakes === null ) {
            return [<Picker.Item key="makesNull" value="" label="Loading..." />]
        }
        
        var allMakes;
        allMakes = this.state.allMakes.map((make) => {
            return (<Picker.Item key={""+make.make_id} value={make.make_id} label={""+make.make_display} />);
        })
        allMakes.splice(0,0, <Picker.Item key="selectMake" value="" label="Select a Make" />);
        return allMakes;
    }
    
    getModelOptions = () => {
        if (this.props.formikProps.values.make === "") {
            return <Picker.Item value="" label="No Make Chosen" />;
        }
        
        if (this.state.allModels === null) {
            return [<Picker.Item key="modelsNull" value="" label="Loading..." /> ]
        }
        
        var allModels;
        allModels = this.state.allModels.map((model) => {
            return (<Picker.Item key={""+model.model_name} value={model.model_name} label={""+model.model_name} />);
        })
        allModels.splice(0,0, <Picker.Item key="selectModel" value="" label="Select a Model" />);
        return allModels;
    }

    async handleYearChange(selectedYear) {
        if (selectedYear !== "") {
            queryFunctions.getAllCarMakes(selectedYear)
                .then(res => this.setState({allMakes: res}))
                .catch(err => console.log(err));
        }

        await this.props.formikProps.setFieldValue('model', "");
        await this.props.formikProps.setFieldValue('make', "");
        await this.props.formikProps.setFieldValue('year', selectedYear);
    }
    
    async handleMakeChange(selectedMake) {
        if (selectedMake !== "") {
            queryFunctions.getAllCarModels(selectedMake, this.props.formikProps.values.year)
                .then(res => this.setState({ allModels: res }))
                .catch(err => console.log(err));
        }

        await this.props.formikProps.setFieldValue('model', "");
        await this.props.formikProps.setFieldValue('make', selectedMake);
    }

    async handleModelChange(selectedModel) {
        await this.props.formikProps.setFieldValue('model', selectedModel);
    }

    render() {
        console.log(this.props.formikProps.values)
        return (
            <Modal 
                avoidKeyboard={true}
                style={{
                    margin: 20,
                    flex: 1,
                }}
                isVisible={this.props.shouldGetPutData || this.props.shouldGetPostData}>
                <View style={{flex:1, backgroundColor: 'white'}}>
                    <Row textStyle={{textAlign: 'center'}} style={{flex:1,}} data={[
                        <View>
                            <Text style={{ fontSize: 20, alignSelf: 'center' }}>Year</Text>
                            {this.props.formikProps.errors.year &&
                                <Text style={{ fontSize: 15, color: 'red', alignSelf: 'center' }}>{this.props.formikProps.errors.year}</Text>
                            } 
                        </View>, 
                        <Picker key="yearForm"
                            itemStyle={{height: 140}}
                            onValueChange={(selectedYear) => this.handleYearChange(selectedYear)}
                            selectedValue={this.props.formikProps.values.year}
                        >
                            {this.getYearOptions()}
                        </Picker> ]} 
                    />
                    <Row textStyle={{textAlign: 'center'}} style={{flex:1}} data={[
                        <View>
                            <Text style={{ fontSize: 20, alignSelf: 'center' }}>Make</Text>
                            {this.props.formikProps.errors.make &&
                                <Text style={{ fontSize: 15, color: 'red', alignSelf: 'center' }}>{this.props.formikProps.errors.make}</Text>
                            } 
                        </View>,
                        <Picker key="makeForm"
                            itemStyle={{height: 140}}
                            onValueChange={(selectedMake) => this.handleMakeChange(selectedMake)}
                            selectedValue={this.props.formikProps.values.make}
                        >
                            {this.getMakeOptions()}
                        </Picker> ]} 
                    />
                    <Row textStyle={{textAlign: 'center'}} style={{flex:1}} data={[
                        <View>
                            <Text style={{ fontSize: 20, alignSelf: 'center' }}>Model</Text>
                            {this.props.formikProps.errors.model &&
                                <Text style={{ fontSize: 15, color: 'red', alignSelf: 'center' }}>{this.props.formikProps.errors.model}</Text>
                            } 
                        </View>,
                        <Picker key="modelForm"
                            itemStyle={{height: 140}}
                            onValueChange={(selectedModel) => this.handleModelChange(selectedModel)}
                            selectedValue={this.props.formikProps.values.model}
                        >
                            {this.getModelOptions()}
                        </Picker> ]} 
                    />
                    <Row textStyle={{textAlign: 'center'}} style={{flex:1}} data={[
                        <View>
                            <Text style={{ fontSize: 20, alignSelf: 'center' }}>Rating</Text>
                            {this.props.formikProps.errors.rating &&
                                <Text style={{ fontSize: 15, color: 'red', alignSelf: 'center' }}>{this.props.formikProps.errors.rating}</Text>
                            } 
                        </View>,
                        <TextInput key="ratingForm"
                            onChangeText={this.props.formikProps.handleChange('rating')}
                            value={""+this.props.formikProps.values.rating}
                            placeholder="Rating"
                            keyboardType='numeric'
                        /> ]} 
                    />
                    <Row data={[
                        <TouchableOpacity style={{backgroundColor: '#57b0ff', justifyContent: 'center', flexDirection: 'row'}} onPress={this.props.cancel}>
                            <Text style={{color: 'white', fontSize: 19}}>CANCEL</Text>
                        </TouchableOpacity>,
                        <TouchableOpacity style={{backgroundColor: '#57b0ff', justifyContent: 'center', flexDirection: 'row'}} onPress={this.props.formikProps.handleSubmit} >
                            <Text style={{color: 'white', fontSize: 19}}>{this.props.buttonText}</Text>
                        </TouchableOpacity>
                        ]}
                    />
                </View>
            </Modal>
        )  
    }
}

export default CarFormComponent;