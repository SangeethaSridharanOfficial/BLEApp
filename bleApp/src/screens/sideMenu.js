import React, {useState, useEffect, useContext} from 'react';
import { Alert, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { DEVICES, HOME, PROFILE, SETTINGS } from '../constants/routeNames';
import loginAction from '../context/actions/loginAction';
import { GlobalContext } from '../context/Provider';
import SMContainer from '../components/container/smContainer';
import styles from '../components/container/styles';

const SideMenu = ({ navigation }) => {
    const { authDispatch, authState: {isLoggedIn, data} } = useContext(GlobalContext);

    return(
        <SafeAreaView>
            <SMContainer>
                <TouchableOpacity style={[styles.devicesOpt, styles.smOpts]} onPress={() => {
                  navigation.navigate(HOME)
                }}>
                  <Text style={styles.textStyle}>{HOME}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.devicesOpt, styles.smOpts]} onPress={() => {
                  navigation.navigate(DEVICES)
                }}>
                  <Text style={styles.textStyle}>{DEVICES}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.devicesOpt, styles.smOpts]} onPress={() => {
                  navigation.navigate(PROFILE)
                }}>
                  <Text style={styles.textStyle}>{PROFILE}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingsOpt, styles.smOpts]} onPress={() => {
                  navigation.navigate(SETTINGS)
                }}>
                  <Text style={styles.textStyle}>{SETTINGS}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.logoutOpt, styles.smOpts]} onPress={_ => {
                    navigation.toggleDrawer();
                    Alert.alert('Logout!', 'Are you sure you want to logout?', [
                        {
                          text: 'Cancel',
                          onPress: () => {},
                        },
                  
                        {
                          text: 'OK',
                          onPress: () => {
                            loginAction('LOGOUT')(authDispatch);
                          },
                        },
                    ]);
                    
                }}>
                    <Text style={styles.textStyle}>Logout</Text>
                </TouchableOpacity>
            </SMContainer>
        </SafeAreaView>
    )
}

export default SideMenu;