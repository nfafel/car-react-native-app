import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import Icon from 'react-native-vector-icons/FontAwesome';

import CarsComponent from './CarsComponent'
import GraphQLHomeComponent from './GraphQLHomeComponent'
import GraphQLRepairsComponent from './GraphQLRepairsComponent'

class HomeScreen extends Component {
    render() {
      return (
        <GraphQLHomeComponent />
      );
    }
}
  
class CarsScreen extends Component {
    render() {
      return ( 
        <CarsComponent queryFuncType="GraphQL" />
      );
    }
}
  
class RepairsScreen extends Component {
    render() {
      return (
        <GraphQLRepairsComponent />
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