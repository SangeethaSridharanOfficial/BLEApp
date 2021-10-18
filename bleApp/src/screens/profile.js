import React, {useState, useEffect, useContext} from 'react';
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import styles from '../container/styles';

const Profile = () => {
    return(
        <SafeAreaView style={styles.profileWrapper}>
            <View style={styles.pHeaderWrapper}>
                <MaterialIcon size={25} name="menu" />
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