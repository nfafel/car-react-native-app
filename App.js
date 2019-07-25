import React, { Component, Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import RestAppContainer from './RestAppTabNavigator';
import GraphQLAppContainer from './GraphQLAppTabNavigator';
import { thisExpression } from '@babel/types';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MenuProvider, MenuTrigger, Menu, MenuOptions, MenuOption } from 'react-native-popup-menu';

class App extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      version: null,
      appContainer: RestAppContainer,
      queryType: "rest"
    }
  }

  componentDidMount() {
    this.getVersionData()
      .then(res => this.setState({ version: res.version }))
      .catch(err => console.log(err));
  }

  getVersionData = async() => {
    const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/version');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
  };

  getVersionText = () => {
    if (this.state.version == null) {
      return (
        <View style={{alignSelf: 'center'}}>
          <Text style={styles.version}>Loading...</Text>
        </View>
      )
    } 
    return (
      <View style={{alignSelf: 'center'}}>
        <Text style={styles.version}>{this.state.version}</Text>
      </View>
    )
  }

  render () { 
    var restBackground, graphqlBackground;
    if (this.state.queryType == "rest") {
      restBackground = "cyan"
      graphqlBackground = "white"
    } else {
      restBackground = "white"
      graphqlBackground = "cyan"
    }

    return (
      <Fragment>
        <MenuProvider>

        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{flex: 1}}>
            <View style={{backgroundColor: 'powderblue', marginBottom: 10}} >
                <View>
                  <Text style={styles.title}>Car Repair App</Text>
                  {this.getVersionText()}
                </View>
                <View style={{position: 'absolute', right: 10, top: 8}}>
                  <Menu>
                    <MenuTrigger>
                      <Icon name="ellipsis-v" size={25} color="#6e737a" />
                    </MenuTrigger>
                    <MenuOptions>
                      <MenuOption style={{backgroundColor: restBackground}} text="REST" onSelect={() => this.setState({appContainer: RestAppContainer, queryType: "rest"})} />
                      <MenuOption style={{backgroundColor: graphqlBackground}} text="GraphQL" onSelect={() => this.setState({appContainer: GraphQLAppContainer, queryType: "graphql"})} />
                    </MenuOptions>
                  </Menu>
                </View>
            </View>
            <this.state.appContainer queryType={this.state.queryType} />
        </SafeAreaView>

        </MenuProvider>
      </Fragment>
    );

  }

}


const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  title: {
    fontSize: 40, 
    fontWeight: '600', 
    color: Colors.black, 
    textAlign: 'center'
  },
  version: {
    fontSize: 20, 
    fontWeight: '600', 
    color: Colors.black, 
    textAlign: 'auto'
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
