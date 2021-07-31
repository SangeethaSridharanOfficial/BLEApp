import React, {useState, useEffect, useContext} from 'react';
import { View, Text } from 'react-native';
import Header from './header';
import {useNavigation} from '@react-navigation/native';
import { GlobalContext } from '../context/Provider';
import Map from '../components/map';

const Home = () => {
    const {setOptions, toggleDrawer} = useNavigation();
    const { authState: {data} } = useContext(GlobalContext);

    useEffect(() => {
        setOptions({
            headerStyle: {
                backgroundColor: '#ccccf8'
            },
            headerTitle: () => <Header toggleDrawer={toggleDrawer} data={data}/>
        });
    }, [])

    return(
        <View>
            <Map/>
        </View>
    )
}

export default Home;