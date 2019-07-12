import React, { Component, Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import AppContainer from './AppTabNavigator';
import { thisExpression } from '@babel/types';

class App extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      version: null
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
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={{flex: 1, backgroundColor: 'powderblue', marginBottom: 10}} >
              <Text style={styles.title}>Car Repair App</Text>
              {this.getVersionText()}
            </View>
          </ScrollView>
        </SafeAreaView>
        <AppContainer />
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
