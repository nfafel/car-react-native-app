import React, {Component} from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { connect } from 'react-redux';
import {logoutUser} from '../redux/actions';

const queryFunctions = require('./graphQLQueriesForRepairs');
const subscriptions = require('./subscriptions');

import client from './apolloClient';

class HomeComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            mergedRepairs: null
        }
    }
    
    async componentDidMount() {
        try {
            const repairs = await queryFunctions.getRepairsData(this.props.token);
            this.setState({mergedRepairs: repairs});
            
            client.subscribe(subscriptions.repairCreatedSubscription).subscribe(res => {
                const newRepairs = [].concat(this.state.mergedRepairs);
                newRepairs.push(res.data.repairCreated);
                this.setState({mergedRepairs: newRepairs})
            });

            client.subscribe(subscriptions.repairUpdatedSubscription).subscribe(res => {
                const newRepairs = this.state.mergedRepairs.map(repair => {
                    if (repair._id !== res.data.repairUpdated._id) {
                        return repair;
                    } else {
                        return res.data.repairUpdated;
                    }
                })
                this.setState({mergedRepairs: newRepairs})
            });

            client.subscribe(subscriptions.repairRemovedSubscription).subscribe(res => {
                const deletedId = res.data.repairRemoved
                const newRepairs = this.state.mergedRepairs.filter(repair => repair._id !== deletedId)
                this.setState({mergedRepairs: newRepairs})
            });

            client.subscribe(subscriptions.carUpdatedSubscription).subscribe(res => {
                var newRepairs = [].concat(this.state.mergedRepairs);
                newRepairs.forEach(repair => {
                    if (repair.car._id === res.data.carUpdated._id) {
                        repair.car = res.data.carUpdated;
                    }
                });
                this.setState({mergedRepairs: newRepairs});
            })

            client.subscribe(subscriptions.carRemovedSubscription).subscribe(res => {
                const deletedId = res.data.carRemoved
                const newRepairs = this.state.mergedRepairs.filter(repair => repair.car._id !== deletedId);
                this.setState({mergedRepairs: newRepairs})
            })

        } catch(err) {
            if (err.message === "GraphQL error: Unautenticated") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message);
        }
    }

    getRepairsDisplay = () => {
        var repairsDisplay = [];
        var numRepairs = this.state.mergedRepairs.length;

        for (var i=numRepairs-1; i>=0; i--) {
            var repair = this.state.mergedRepairs[i];
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
        if (this.state.mergedRepairs === null) {
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