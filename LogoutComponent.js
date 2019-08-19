import React, {Component} from 'react';
import {logoutUser} from './redux/actions';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text } from 'react-native';

class LogoutComponent extends Component {
    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.props.logoutUser() } >
                    <Text>Sign Out</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const mapDispatchToProps = function(dispatch) {
    return {
        logoutUser: () => dispatch(logoutUser()),
    }
}
  
export default connect(null, mapDispatchToProps)(LogoutComponent);