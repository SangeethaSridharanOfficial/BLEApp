import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Text, View, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import LocHeader from '../components/location/header';
import styles from '../components/location/styles';

export default Location = () => {
    const {navigate, setOptions} = useNavigation();
    useEffect(() => {
        setOptions({
            headerStyle: {
                backgroundColor: '#ccccf8'
            },
            headerTitle: () => <LocHeader navigate={navigate}/>
        });
    }, [])

    return (
        <View style={styles.locContainer}>
            <Text>There is no data found</Text>
        </View>
    )
}