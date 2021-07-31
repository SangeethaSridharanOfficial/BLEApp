import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HOME } from '../constants/routeNames';
import Home from '../screens/home';


const HomeNav = () => {
    const HomeStack = createStackNavigator();

    return (
        <HomeStack.Navigator initialRouteName={HOME}>
            <HomeStack.Screen name={HOME} component={Home}></HomeStack.Screen>
        </HomeStack.Navigator>
    )
}

export default HomeNav;