import React, {useState, useEffect, useContext} from 'react';
import { Alert, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { DEVICES, HOME, PROFILE, SETTINGS } from '../constants/routeNames';
import loginAction from '../context/actions/loginAction';
import { GlobalContext } from '../context/Provider';
import SMContainer from '../components/container/smContainer';
import styles from '../components/container/styles';
import colors from '../assets/themes/colors';

const SideMenu = ({ navigation }) => {
    const { authDispatch, authState: {isLoggedIn, data} } = useContext(GlobalContext);
    const [activeState, setActiveState] = useState(HOME);

    return(
        <SafeAreaView>
            <SMContainer>
                <TouchableOpacity style={[styles.homeOpt, styles.smOpts, {backgroundColor: `${activeState === HOME ? '#f2f2f2' : 'white'}`}]}  onPress={() => {
                  navigation.navigate(HOME);
                  setActiveState(HOME);
                }}>
                  <Text style={[styles.textStyle, {color: `${activeState === HOME ? colors.accent : colors.black}`}]}>{HOME}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.devicesOpt, styles.smOpts, {backgroundColor: `${activeState === DEVICES ? '#f2f2f2' : 'white'}`}]} onPress={() => {
                  navigation.navigate(DEVICES);
                  setActiveState(DEVICES);
                }}>
                  <Text style={[styles.textStyle, {color: `${activeState === DEVICES ? colors.accent : colors.black}`}]}>{DEVICES}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.profileOpt, styles.smOpts, {backgroundColor: `${activeState === PROFILE ? '#f2f2f2' : 'white'}`}]} onPress={() => {
                  navigation.navigate(PROFILE);
                  setActiveState(PROFILE);
                }}>
                  <Text style={[styles.textStyle, {color: `${activeState === PROFILE ? colors.accent : colors.black}`}]}>{PROFILE}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingsOpt, styles.smOpts, {backgroundColor: `${activeState === SETTINGS ? '#f2f2f2' : 'white'}`}]} onPress={() => {
                  navigation.navigate(SETTINGS);
                  setActiveState(SETTINGS);
                }}>
                  <Text style={[styles.textStyle, {color: `${activeState === SETTINGS ? colors.accent : colors.black}`}]}>{SETTINGS}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.logoutOpt, styles.smOpts, {backgroundColor: 'white'}]} onPress={_ => {
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
                    <Text style={[styles.textStyle]}>Logout</Text>
                </TouchableOpacity>
            </SMContainer>
        </SafeAreaView>
    )
}

export default SideMenu;