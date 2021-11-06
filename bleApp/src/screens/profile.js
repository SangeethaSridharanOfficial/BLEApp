import React, {useState, useEffect, useContext} from 'react';
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import styles from '../container/styles';
import {useNavigation} from '@react-navigation/native';
import { PROFILE } from '../constants/routeNames';
import Header from './header';

const Profile = () => {
    const {setOptions, toggleDrawer} = useNavigation();
    useEffect(() => {
        setOptions({
            headerStyle: {
                backgroundColor: '#ccccf8'
            },
            headerTitle: () => <Header toggleDrawer={toggleDrawer} activePage={PROFILE}/>
        });
    }, [])

    return(
        <SafeAreaView style={styles.profileWrapper}>
            <View style={styles.pHeaderWrapper}>
                <View style={styles.imageWrapper}>
                    <Image source={require('../assets/images/login.png')}
                        style={styles.profileImg}></Image>
                </View>
            </View>
            <ScrollView>
                <Text>Email</Text>
            </ScrollView>
            <View>
                <TouchableOpacity>
                    <Text>Edit Profile</Text>
                    <FeatherIcon size={25} name="edit" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Profile;