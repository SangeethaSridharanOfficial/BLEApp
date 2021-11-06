import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PROFILE } from '../constants/routeNames';
import { GlobalContext } from '../context/Provider';
import Header from '../screens/header';
import Profile from '../screens/profile';


const ProfileNav = () => {
    const ProfileStack = createStackNavigator();
    const { deviceState: {activeState}} = useContext(GlobalContext);

    return  activeState === PROFILE && <ProfileStack.Navigator initialRouteName={PROFILE}>
            <ProfileStack.Screen name={PROFILE} component={Profile}/>
        </ProfileStack.Navigator>
    
}

export default ProfileNav;