import React, {Component} from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Table, Row, Col, Rows } from 'react-native-table-component';
import { connect } from 'react-redux';
import {logoutUser} from '../redux/actions';

const queryFunctions = require('./graphQLQueriesForRepairs')

class HomeComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            repairs: null
        }
    }
    
    async componentDidMount() {
        try {
            const repairs = await queryFunctions.getRepairsData(this.props.token);
            this.setState({repairs: repairs});
        } catch(err) {
            if (err.message === "GraphQL error: Unautticated") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message);
        }
        
        // queryFunctions.subscribeToRepairsData(this)
        //     .catch(err => console.log(err)); 
    }

    getRepairsDisplay = () => {
        var repairsDisplay = [];
        var numRepairs = this.state.repairs.length;

        for (var i=numRepairs-1; i>=0; i--) {
            var repair = this.state.repairs[i];
            if (numRepairs <= 5 || i >= numRepairs-5) {
                repairsDisplay.push(
                    <View style={{marginVertical: 10}}>
                        <Table>
                            <Row style={{backgroundColor:'#b2b2b8'}} textStyle={{textAlign: 'center'}} data={['Car', repair.car.year +" "+ repair.car.make +" "+ repair.car.model]} />
                            <Row textStyle={{textAlign: 'center'}} data={['Date Admitted', repair.date.split('T', 1)]} />
                            <Row textStyle={{textAlign: 'center'}} data={['Description', repair.description]} />
                            <Row textStyle={{textAlign: 'center'}} data={['Cost', repair.cost]} />
                            <Row textStyle={{textAlign: 'center'}} data={['Progress', repair.progress]} />
                            <Row textStyle={{textAlign: 'center'}} data={['Technician', repair.technician]} />
                        </Table>
                    </View>
                )
            }
        }
        return repairsDisplay;
    }
    
    render() {
        if (this.state.repairs == null) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{color: 'black', fontSize: 25, fontWeight: 'bold'}}>Loading...</Text>
                </View>
            )
        }

        return(
            <View style={{marginHorizontal: 20, flex:1, flexDirection:'column', alignItems: 'stretch', justifyContent: 'center'}}>
                <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                    <Text style={{fontSize: 20}}>Latest Repairs - GraphQL</Text>
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

const mapStateToProps = function(state) {
    return {
        token: state.token
    }
}
const mapDispatchToProps = function(dispatch) {
    return {
        logoutUser: () => dispatch(logoutUser()),
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);