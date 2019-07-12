import React, {Component} from 'react';
import { View, Text, Button, ScrollView, TextInput, StyleSheet } from 'react-native';
import { Table, Row } from 'react-native-table-component';

class RepairsByCarComponent extends Component {

    getRepairTableRows = () => {
        var repairsDisplay;
        repairsDisplay = this.props.repairsForCar.map((repair) => { 
            return (
                <Row textStyle={{textAlign: 'center'}} data={[
                    repair.date.split('T', 1),
                    repair.description,
                    repair.cost,
                    repair.progress,
                    repair.technician]}
                />
            )
        });
        return repairsDisplay;
    }

    render() {
        if (this.props.repairsForCar[0] === undefined) {
            return (<Text>No Repairs Recorded for the {this.props.repairCarYear} {this.props.repairCarMake} {this.props.repairCarModel}</Text>);
        }
        return(
            <View>
                <Text>Repairs for the {this.props.repairCarYear} {this.props.repairCarMake} {this.props.repairCarModel}</Text>
                <Table>
                    <Row textStyle={{textAlign: 'center'}} data={[
                        'Date',
                        'Decription',
                        'Cost',
                        'Progress',
                        'Technician'
                        ]}
                    />
                    {this.getRepairTableRows()}
                </Table>
            </View>
        );
    }
  }
  
  export default RepairsByCarComponent;