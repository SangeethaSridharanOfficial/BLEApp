import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TEMPERATURE } from '../constants/routeNames';
import Temperature from '../screens/temperature';
import { GlobalContext } from '../context/Provider';


const TempNav = () => {
    const TempStack = createStackNavigator();
    const { deviceState: {activeState}} = useContext(GlobalContext);

    return  activeState === TEMPERATURE && <TempStack.Navigator initialRouteName={TEMPERATURE}>
            <TempStack.Screen name={TEMPERATURE} component={Temperature}/>
        </TempStack.Navigator>
    
}

export default TempNav;