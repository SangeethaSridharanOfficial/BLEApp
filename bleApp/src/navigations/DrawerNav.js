import React, { useContext } from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DEVICES, SETTINGS, PROFILE, HOME, TEMPERATURE } from '../constants/routeNames';
import DeviceNav from './DeviceNav';
import Settings from './SettingsNav';
import SideMenu from '../screens/sideMenu';
import Profile from '../screens/profile';
import HomeNav from './HomeNav';
import TempNav from './TempNav';

const Drawer = createDrawerNavigator();

const DrawerNav = () => {
    return (
        <Drawer.Navigator 
            drawerType="slide" 
            drawerContent={({navigation}) =>
                <SideMenu navigation={navigation}/>
        }>
            <Drawer.Screen name={HOME} component={HomeNav}/>
            <Drawer.Screen name={DEVICES} component={DeviceNav} />
            <Drawer.Screen name={SETTINGS} component={Settings} />
            <Drawer.Screen name={PROFILE} component={Profile} />
            <Drawer.Screen name={TEMPERATURE} component={TempNav} />
        </Drawer.Navigator>
    )
}

export default DrawerNav;