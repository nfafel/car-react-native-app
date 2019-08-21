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

import RestAppContainer from './Rest/RestAppTabNavigator';
import GraphQLAppContainer from './GraphQL/GraphQLAppTabNavigator';
import MenuComponent from './MenuComponent'
import RegistrationComponent from './RegistrationComponent'
import LoginComponent from './LoginComponent'
import { Provider, connect } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './redux/store'
import { MenuProvider } from 'react-native-popup-menu';

class CarRepairApp extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      version: null,
      newAccountForm: "closed"
    }
  }

  async componentDidMount() {
    try{
      const response = await this.getVersionData();
      this.setState({version: response.version})
    } catch(err) {
      console.log(err);
    }
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
          <Text style={{color: "white"}}>Loading...</Text>
        </View>
      )
    } 
    return (
      <View style={{alignSelf: 'center'}}>
        <Text style={{color: "white", fontSize: 15}}>{this.state.version}</Text>
      </View>
    )
  }

  render () { 
    console.log(this.props.queryType)
    return (
      <Fragment>
        <MenuProvider>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView style={{flex: 1, backgroundColor: "white"}}>
              <View style={{flex: 0, zIndex:1, backgroundColor: '#282c34'}} >
                <Text style={styles.title}>Car Repair App</Text>
                {this.getVersionText()}
                {(this.props.token !== "") && <MenuComponent />}
              </View>
              {(this.props.token === "") ? 
                (<View style={{flex: 0, flexGrow: 0.8, flexDirection: "column", justifyContent: "center"}}>
                  {(this.state.newAccountForm === "closed") ? 
                    (<LoginComponent createAccount={() => this.setState({newAccountForm: "open"})}/>)
                    : 
                    (<RegistrationComponent cancel={() => this.setState({newAccountForm: "closed"})} />) 
                  }
                </View>)
                :
                (
                  <View style={{flex: 0, flexGrow: 1}}>
                    {(this.props.queryType === "rest") ? (<RestAppContainer />) : (<GraphQLAppContainer />) }
                  </View>
                )
              }
          </SafeAreaView>
        </MenuProvider>
      </Fragment>
    );
  }
}

const mapStateToProps = function(state) {
  return {
      token: state.token,
      queryType: state.queryType
  }
}

const ConnectedApp = connect(mapStateToProps)(CarRepairApp);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConnectedApp />
        </PersistGate>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#282c34",
  },
  title: {
    fontSize: 40, 
    fontWeight: '600', 
    color: Colors.white, 
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
