import React, {Component} from 'react';
import { View, Text, Button, ScrollView, TextInput, StyleSheet } from 'react-native';
import { Table, Row, Col } from 'react-native-table-component';

class RepairsByCarComponent extends Component {

    getRepairTableRows = () => {
        var repairsDisplay;
        repairsDisplay = this.props.repairsForCar.map((repair) => { 
            return (
                <View style={{marginVertical: 10}}>
                    <Table>
                        <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Col textStyle={{textAlign: 'center'}} data={[
                            'Date',
                            'Decription',
                            'Cost',
                            'Progress',
                            'Technician'
                            ]}
                        />
                        <Col textStyle={{textAlign: 'center'}} data={[
                            repair.date.split('T', 1),
                            repair.description,
                            repair.cost,
                            repair.progress,
                            repair.technician]}
                        />
                        </View>
                    </Table>
                </View>
            )
        });
        return repairsDisplay;
    }

    render() {
        if (this.props.repairsForCar[0] === undefined) {
            return (<Text>No Repairs Recorded for the {this.props.repairCar.year} {this.props.repairCar.make} {this.props.repairCar.model}</Text>);
        }
        return(
            <ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>Repairs for the {this.props.repairCar.year} {this.props.repairCar.make} {this.props.repairCar.model}</Text>
                </View>
                {this.getRepairTableRows()}
            </ScrollView>
        );
    }
  }
  
  export default RepairsByCarComponent;