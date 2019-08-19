import React, {Component} from 'react';
import { View } from 'react-native'
import LogoutComponent from './LogoutComponent'
import SubscriptionComponent from './SubscriptionComponent'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/FontAwesome';

class MenuComponent extends Component {
    render() {
        return (
            <View style={{position: "absolute", top: 5, right: 5, zIndex: 2}}>
                <Menu>
                    <MenuTrigger> 
                        <Icon name="bars" size={30} color="white" />
                    </MenuTrigger>
                    <MenuOptions>
                        <MenuOption style={{borderWidth: 0.3}}>
                            <SubscriptionComponent />
                        </MenuOption>
                        <MenuOption style={{borderWidth: 0.3, backgroundColor: "#fc584c"}}>
                            <LogoutComponent />
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>
        )
    }
}

export default MenuComponent;