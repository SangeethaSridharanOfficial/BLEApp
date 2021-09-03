import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HOME } from '../constants/routeNames';
import Home from '../screens/home';
import { GlobalContext } from '../context/Provider';


const HomeNav = () => {
    const HomeStack = createStackNavigator();
    const { deviceDispatch, deviceState: {activeState, devices}} = useContext(GlobalContext);

    return activeState === HOME &&
                <HomeStack.Navigator initialRouteName={HOME}>
                    <HomeStack.Screen name={HOME} component={Home}></HomeStack.Screen>
                </HomeStack.Navigator>
            
        
    
}

export default HomeNav;