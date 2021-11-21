import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LOCATION } from '../constants/routeNames';
import Location from '../screens/location';
import { GlobalContext } from '../context/Provider';


const LocationNav = () => {
    const LocStack = createStackNavigator();
    const { deviceState: {activeState}} = useContext(GlobalContext);

    return  activeState === LOCATION && <LocStack.Navigator initialRouteName={LOCATION}>
            <LocStack.Screen name={LOCATION} component={Location}/>
        </LocStack.Navigator>
    
}

export default LocationNav;