import React, {Component} from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text } from 'react-native'
const jwtDecode = require('jwt-decode');
const { changeSubscription } = require('./redux/actions')

class SubscriptionComponent extends Component {
    constructor(props){
      super(props);
      this.state = {
        phoneNumber: null,
      }
    }

    componentDidMount() {
        const decoded = jwtDecode(this.props.token);
        this.setState({ 
            phoneNumber: decoded.payload.phoneNumber,
        })
    }

    changeSubscription = async() => {
        try {
            const subscriptionResponse = await fetch(`https://tranquil-caverns-41069.herokuapp.com/users/changeSubscription`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${this.props.token}`
                },
                body: JSON.stringify({
                    subscribed: !this.props.subscribed,
                })
            });
            const newSubscription = await subscriptionResponse.json()
            this.props.changeSubscription(newSubscription);
        } catch(err) {
            if (err.statusCode === 401) {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err)
        }
    }

    render() {
        var subscriptionText;
        if (this.props.subscribed) {
            subscriptionText = 'Unsubscribe from Text Notifications';
        } else {
            subscriptionText = 'Subscribe to Text Notifications';
        }

        return (
            <View>
                <TouchableOpacity onPress={() => this.changeSubscription()}>
                    <Text>{subscriptionText}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        token: state.token,
        subscribed: state.subscribed
    }
}
const mapDispatchToProps = function(dispatch) {
    return {
        changeSubscription: subscribed => dispatch(changeSubscription({subscribed: subscribed})),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionComponent);