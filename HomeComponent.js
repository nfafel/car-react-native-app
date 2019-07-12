import React, {Component} from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Table, Row, Col } from 'react-native-table-component';

const queryFunctions = require('./queryFuncForRepairsComponent')

class HomeComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            repairs: null,
            cars: null
        }
    }
    
    componentDidMount() {
        queryFunctions.getRepairsData()
            .then(res => this.setState({ repairs: res.repairs }))
            .catch(err => console.log(err)); 
            
        queryFunctions.getCarsData()
            .then(res => this.setState({ cars: res.cars }))
            .catch(err => console.log(err));
    }

    tableStyles = {
        
    };

    rowColStyles = {
        
    };

    getCarForRepair = (carId) => {
        for (var i = 0; i<this.state.cars.length; i++) {
            if (this.state.cars[i]._id === carId) {
                return this.state.cars[i];
            }
        }
    }

    reverseRepairsDisplay = (repairsDisplay) => {
        var reversedRepairsDisplay = [];
        for (var i=repairsDisplay.length-1; i>=0; i--) {
            reversedRepairsDisplay.push(repairsDisplay[i]);
        }
        return reversedRepairsDisplay;
    }

    getRepairsDisplay = () => {
        var repairsDisplay = [];
        var numRepairs = this.state.repairs.length;

        for (var i=0; i<numRepairs; i++) {
            var repair = this.state.repairs[i];
            var carRepaired = this.getCarForRepair(repair.car_id);
            if (numRepairs <= 5 || i >= numRepairs-5) {
                repairsDisplay.push(
                    <View style={{marginVertical: 10}}>
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
                                    carRepaired.year +" "+ carRepaired.make +" "+ carRepaired.model,
                                    repair.date.split('T', 1),
                                    repair.description,
                                    repair.cost,
                                    repair.progress,
                                    repair.technician
                                    ]}
                                />
                            </View>
                        </Table>
                    </View>
                )
            }
        }
        var formattedRepairsDisplay = this.reverseRepairsDisplay(repairsDisplay);
        return formattedRepairsDisplay;
    }
    
    render() {
        if (this.state.repairs == null || this.state.cars == null) {
            return (<Text>Loading...</Text>);
        }

        return(
            <View style={{marginHorizontal: 20, flex:1, flexDirection:'column', alignItems: 'stretch', justifyContent: 'center'}}>
                <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                    <Text style={{fontSize: 20}}>Latest Repairs</Text>
                </View>
                <ScrollView style={{flex:1}} >
                    <View style={{flex:1, flexDirection: 'column', justifyContent: 'space-between'}}>
                        {this.getRepairsDisplay()}
                    </View>
                </ScrollView>
            </View>
        );
    }
  }
  
  export default HomeComponent;