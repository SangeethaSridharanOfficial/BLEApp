import React, {useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigation from './AuthNav';
import DrawerNav from './DrawerNav';
import { GlobalContext } from '../context/Provider';

const AppNavigation = () => {
    const {authState: {isLoggedIn}} = useContext(GlobalContext);
    
    return (
        <NavigationContainer>
            {(isLoggedIn) ? <DrawerNav/> : <AuthNavigation/>}
        </NavigationContainer>
    )
}

export default AppNavigation;