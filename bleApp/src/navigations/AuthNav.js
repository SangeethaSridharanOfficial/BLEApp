import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LOGIN, SIGNUP, FORGETPASS, RESETPASS } from '../constants/routeNames';
import Login from '../screens/login';
import Signup from '../screens/signup';
import ResetPassword from '../screens/resetpassword';
import ForgetPassword from '../screens/forgetpassword';

const AuthNavigation = () => {
    const AuthStack = createStackNavigator();
    return (
        <AuthStack.Navigator screenOptions={{headerShown: false}}>
            <AuthStack.Screen name={LOGIN} component={Login}></AuthStack.Screen>
            <AuthStack.Screen name={SIGNUP} component={Signup}></AuthStack.Screen>
            <AuthStack.Screen name={RESETPASS} component={ResetPassword}></AuthStack.Screen>
            <AuthStack.Screen name={FORGETPASS} component={ForgetPassword}></AuthStack.Screen>
        </AuthStack.Navigator>
    )
}

export default AuthNavigation;