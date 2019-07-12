import React, {Component} from 'react';
import { View, Text, Button, TextInput, Picker } from 'react-native';
import { Row } from 'react-native-table-component';
import DateTimePicker from "react-native-modal-datetime-picker";

class RepairFormComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datePickerVisible: false
        };
    }

    carOptions = () => {
        var carOptions = this.props.cars.map((car) => {
            return (
                <Picker.Item value={car._id} label={car.year +" "+ car.make +" "+ car.model} />
            )
        });
        
        carOptions.splice(0,0, <Picker.Item value="" label="Select a Car" />);

        return carOptions;
    } 

    getDateTitle = () => {
        if (this.props.formikProps.values.date === "") {
            return ("Select a Date");
        } else if (this.props.formikProps.values.date instanceof Date) {
            return (""+this.props.formikProps.values.date.toISOString().split('T', 1));
        } 
        return (""+ this.props.formikProps.values.date.split('T', 1));
    }

    updateRepairForm = () => {
        return ( <Row data={[
            <Picker 
                onValueChange={this.props.formikProps.handleChange('car_id')}
                selectedValue={this.props.formikProps.values.car_id}
            >
                {this.carOptions()}
            </Picker>,
            <View>
                <DateTimePicker
                    onConfirm={this.props.formikProps.handleChange('date')}
                    isVisible={this.state.datePickerVisible}
                    onCancel={() => this.setState({datePickerVisible: false})}
                    onHideAfterConfirm={() => this.setState({datePickerVisible: false})}
                />
                <Button title={this.getDateTitle()} onPress={() => this.setState({datePickerVisible: true})} />
            </View>,
            <View>
                <TextInput
                    onChangeText={this.props.formikProps.handleChange('description')}
                    value={""+this.props.formikProps.values.description}
                    placeholder="Description"
                />
            </View>,
            <View>
                <TextInput
                    onChangeText={this.props.formikProps.handleChange('cost')}
                    value={""+this.props.formikProps.values.cost}
                    placeholder="Cost"
                    keyboardType='numeric'
                />
            </View>,
            <Picker 
                onValueChange={this.props.formikProps.handleChange('progress')}
                selectedValue={this.props.formikProps.values.progress}
            >
                <Picker.Item value="Ready" label="Ready" />
                <Picker.Item value="In Progress" label="In Progress" />
                <Picker.Item value="Completed" label="Completed" />
            </Picker>,
            <View>
                <TextInput
                    onChangeText={this.props.formikProps.handleChange('technician')}
                    value={""+this.props.formikProps.values.technician}
                    placeholder="Technician"
                />
            </View>,
            <View>
                <Button onPress={this.props.cancel} title="CANCEL" />
                <Button onPress={this.props.formikProps.handleSubmit} title="UPDATE" />
            </View>
            ]} /> 
        )
    }

    newRepairForm = () => {
        return (<Row data={[
            <Picker 
                onValueChange={this.props.formikProps.handleChange('car_id')}
                selectedValue={this.props.formikProps.values.car_id}
            >
                {this.carOptions()}
            </Picker>,
            <View>
                <DateTimePicker
                    onConfirm={this.props.formikProps.handleChange('date')}
                    isVisible={this.state.datePickerVisible}
                    onCancel={() => this.setState({datePickerVisible: false})}
                    onHideAfterConfirm={() => this.setState({datePickerVisible: false})}
                />
                <Button title={this.getDateTitle()} onPress={() => this.setState({datePickerVisible: true})} />
            </View>,
            <View>
                <TextInput
                    onChangeText={this.props.formikProps.handleChange('description')}
                    value={""+this.props.formikProps.values.description}
                    placeholder="Description"
                />
            </View>,
            <View>
                <TextInput
                    onChangeText={this.props.formikProps.handleChange('cost')}
                    value={""+this.props.formikProps.values.cost}
                    placeholder="Cost"
                    keyboardType='numeric'
                />
            </View>,
            <Picker 
                onValueChange={this.props.formikProps.handleChange('progress')}
                selectedValue={this.props.formikProps.values.progress}
            >
                <Picker.Item value="" label="Select Progress" />
                <Picker.Item value="Ready" label="Ready" />
                <Picker.Item value="In Progress" label="In Progress" />
                <Picker.Item value="Completed" label="Completed" />
            </Picker>,
            <View>
                <TextInput
                    onChangeText={this.props.formikProps.handleChange('technician')}
                    value={""+this.props.formikProps.values.technician}
                    placeholder="Technician"
                />
            </View>,
            <View>
                <Button onPress={this.props.cancel} title="CANCEL" />
                <Button onPress={this.props.formikProps.handleSubmit} title="Submit" />
            </View>
            ]} /> 
    )}

    render() {

        if (this.props.formType === "update") {
            return (this.updateRepairForm())
        } else {
            return (this.newRepairForm());
        }
    }
}

export default RepairFormComponent;