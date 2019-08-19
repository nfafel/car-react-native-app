import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import Icon from 'react-native-vector-icons/FontAwesome';

import HomeComponent from './HomeComponent'
import CarsComponent from './CarsComponent'
import RepairsComponent from './RepairsComponent'

class HomeScreen extends Component {
    render() {
      return (
        <HomeComponent />
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
        <RepairsComponent />
      );
    }
}

const tabNavigator = createBottomTabNavigator(
  {
    Home: {screen: HomeScreen,
      navigationOptions: {
          tabBarIcon: () => (
              <Icon name="home" size={30} color="#900" />
          )
      }},
    Cars: {screen: CarsScreen,
      navigationOptions: {
          tabBarIcon: () => (
              <Icon name="car" size={30} color="#900" />
          )
      }},
    Repairs: {screen: RepairsScreen,
      navigationOptions: {
          tabBarIcon: () => (
              <Icon name="wrench" size={30} color="#900" />
          )
      }},
  },
  {
    tabBarOptions: {
      labelStyle: {
        fontSize: 20,
        margin: 0,
        padding: 0
      },
      style: {height:60}
    }
  }
);

export default createAppContainer(tabNavigator);