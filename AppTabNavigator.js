import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from "react-navigation";

//import HomeComponent from './HomeComponent'
import CarsComponent from './CarsComponent'
//import RepairsComponent from './RepairsComponent'

class HomeScreen extends Component {
    render() {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{color: 'black', fontSize: 25, fontWeight: 'bold'}}>Home</Text>
        </View>
      );
    }
}
  
class CarsScreen extends Component {
    render() {
      return (
        
          
        <CarsComponent />
       
      );
    }
}
  
class RepairsScreen extends Component {
    render() {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{color: 'black', fontSize: 25, fontWeight: 'bold'}}>Repairs</Text>
        </View>
      );
    }
}
  
const TabNavigator = createBottomTabNavigator(
    {
      Home: {screen: HomeScreen},
      Cars: {screen: CarsScreen},
      Repairs: {screen: RepairsScreen},
    },
    {
      tabBarOptions: {
        labelStyle: {
          fontSize: 20,
          margin: 0,
          padding: 0
        }
      }
    }
);
  
export default createAppContainer(TabNavigator);
  