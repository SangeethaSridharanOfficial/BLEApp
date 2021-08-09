import React, {useState, useEffect, useContext} from 'react';
import { View, Text } from 'react-native';
import Header from './header';
import {useNavigation} from '@react-navigation/native';
import { GlobalContext } from '../context/Provider';
import { SETTINGS } from '../constants/routeNames';

const Settings = () => {
    const {setOptions, toggleDrawer} = useNavigation();
    const { authState: {data} } = useContext(GlobalContext);

    useEffect(() => {
        setOptions({
            headerStyle: {
                backgroundColor: '#ccccf8'
            },
            headerTitle: () => <Header toggleDrawer={toggleDrawer} data={data} activePage={SETTINGS}/>
        });
    }, [])

    return(
        <View>
            <Text>Settings</Text>
        </View>
    )
}

export default Settings;