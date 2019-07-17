import React, {Component} from 'react';
import { View, Text, Button, TextInput, Picker, TouchableOpacity } from 'react-native';
import { Row, Col, Table } from 'react-native-table-component';
import DateTimePicker from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";

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

    getInitDate = () => {
        if (this.props.formikProps.values.date === "") {
            return (new Date());
        } else if (this.props.formikProps.values.date instanceof Date) {
            return (this.props.formikProps.values.date);
        } 
        return (new Date(this.props.formikProps.values.date));
    }

    repairForm = () => {
        return ( 
            <Modal 
                avoidKeyboard={true}
                style={{
                    margin: 20,
                    flex: 1,
                }}
                isVisible={this.props.visible}>
                <View style={{flex:1, backgroundColor: 'white'}}>
                    <Row style={{flex:1}} textStyle={{textAlign: 'center'}} data={[
                        <View>
                            <Text style={{ fontSize: 20, alignSelf: 'center' }}>Car</Text>
                            {this.props.formikProps.errors.car_id &&
                                <Text style={{ fontSize: 15, color: 'red', alignSelf: 'center' }}>{this.props.formikProps.errors.car_id}</Text>
                            } 
                        </View>,
                        <Picker 
                            itemStyle={{height: 100}}
                            onValueChange={this.props.formikProps.handleChange('car_id')}
                            selectedValue={this.props.formikProps.values.car_id}
                        >
                            {this.carOptions()}
                        </Picker> ]} 
                    />
                    <Row style={{flex:1}} textStyle={{textAlign: 'center'}} data={[
                        <View>
                            <Text style={{ fontSize: 20, alignSelf: 'center' }}>Date Admitted</Text>
                            {this.props.formikProps.errors.date &&
                                <Text style={{ fontSize: 15, color: 'red', alignSelf: 'center' }}>{this.props.formikProps.errors.date}</Text>
                            } 
                        </View>, 
                        <View>
                            <DateTimePicker
                                date={this.getInitDate()}
                                onConfirm={(date) => {this.props.formikProps.setFieldValue('date', date ); this.setState({datePickerVisible: false})}}
                                isVisible={this.state.datePickerVisible}
                                onCancel={() => this.setState({datePickerVisible: false})}
                                onHideAfterConfirm={() => this.setState({datePickerVisible: false})}
                            />
                            <TouchableOpacity style={{backgroundColor: 'white', justifyContent: 'center', flexDirection: 'row'}} onPress={() => this.setState({datePickerVisible: true})} >
                                <Text style={{color: 'black', fontSize: 16}}>{this.getDateTitle()}</Text>
                            </TouchableOpacity>
                        </View> ]} 
                    />
                    <Row style={{flex:1}} textStyle={{textAlign: 'center'}} data={[
                        <View>
                            <Text style={{ fontSize: 20, alignSelf: 'center' }}>Description</Text>
                            {this.props.formikProps.errors.description &&
                                <Text style={{ fontSize: 15, color: 'red', alignSelf: 'center' }}>{this.props.formikProps.errors.description}</Text>
                            } 
                        </View>,
                        <TextInput
                            onChangeText={this.props.formikProps.handleChange('description')}
                            value={""+this.props.formikProps.values.description}
                            placeholder="Description"
                        /> ]} 
                    />
                    <Row style={{flex:1}} textStyle={{textAlign: 'center'}} data={[ 
                        <View>
                            <Text style={{ fontSize: 20, alignSelf: 'center' }}>Cost</Text>
                            {this.props.formikProps.errors.cost &&
                                <Text style={{ fontSize: 15, color: 'red', alignSelf: 'center' }}>{this.props.formikProps.errors.cost}</Text>
                            } 
                        </View>,
                        <TextInput
                            onChangeText={this.props.formikProps.handleChange('cost')}
                            value={""+this.props.formikProps.values.cost}
                            placeholder="Cost"
                            keyboardType='numeric'
                        /> ]} 
                    />
                    <Row style={{flex:1}} textStyle={{textAlign: 'center'}} data={[
                        <View>
                            <Text style={{ fontSize: 20, alignSelf: 'center' }}>Progress</Text>
                            {this.props.formikProps.errors.progress &&
                                <Text style={{ fontSize: 15, color: 'red', alignSelf: 'center' }}>{this.props.formikProps.errors.progress}</Text>
                            } 
                        </View>,
                        <Picker 
                            itemStyle={{height: 100}}
                            onValueChange={this.props.formikProps.handleChange('progress')}
                            selectedValue={this.props.formikProps.values.progress}
                        >
                            <Picker.Item value="" label="Select Progress" />
                            <Picker.Item value="Ready" label="Ready" />
                            <Picker.Item value="In Progress" label="In Progress" />
                            <Picker.Item value="Completed" label="Completed" />
                        </Picker> ]} 
                    />
                    <Row style={{flex:1}} textStyle={{textAlign: 'center'}} data={[
                        <View>
                            <Text style={{ fontSize: 20, alignSelf: 'center' }}>Technician</Text>
                            {this.props.formikProps.errors.technician &&
                                <Text style={{ fontSize: 15, color: 'red', alignSelf: 'center' }}>{this.props.formikProps.errors.technician}</Text>
                            } 
                        </View>,
                        <TextInput
                            onChangeText={this.props.formikProps.handleChange('technician')}
                            value={""+this.props.formikProps.values.technician}
                            placeholder="Technician"
                        /> ]} 
                    />
                    <Row textStyle={{textAlign: 'center'}} data={[
                        <TouchableOpacity style={{backgroundColor: '#57b0ff', justifyContent: 'center', flexDirection: 'row'}} onPress={this.props.cancel} >
                            <Text style={{color: 'white', fontSize: 18}}>CANCEL</Text>
                        </TouchableOpacity>,
                        <TouchableOpacity style={{backgroundColor: '#57b0ff', justifyContent: 'center', flexDirection: 'row'}} onPress={this.props.formikProps.handleSubmit} >
                            <Text style={{color: 'white', fontSize: 18}}>{this.props.submitText}</Text>
                        </TouchableOpacity>
                        ]}
                    />
                </View>
            </Modal>
        )
    }

    render() {
        return (this.repairForm())
    }
}

export default RepairFormComponent;