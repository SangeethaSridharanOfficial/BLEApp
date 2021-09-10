import React, {useState, useEffect, useContext} from 'react';
import { Alert, SafeAreaView, View, Text, TouchableOpacity, Image } from 'react-native';
import { DEVICES, HOME, PROFILE, SETTINGS } from '../constants/routeNames';
import loginAction from '../context/actions/loginAction';
import { GlobalContext } from '../context/Provider';
import SMContainer from '../components/container/smContainer';
import styles from '../components/container/styles';
import colors from '../assets/themes/colors';
import devicesAction from '../context/actions/devicesAction';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const SideMenu = ({ navigation }) => {
    const { authDispatch, authState: {isLoggedIn, data}, deviceDispatch } = useContext(GlobalContext);
    const [activeState, setActiveState] = useState(HOME);

    return(
      <SafeAreaView>
        <SMContainer>
          <View style={styles.sm_top}>
            <Image source={require('../assets/images/CPLogo.png')} style={styles.app_icon}></Image>
          </View>
          <View style={styles.so_holder}>
            <TouchableOpacity style={[styles.homeOpt, styles.smOpts, { backgroundColor: `${activeState === HOME ? '#f2f2f2' : 'white'}` }]} onPress={() => {
              navigation.navigate(HOME);
              setActiveState(HOME);
              devicesAction(HOME, 'ACTIVE_STATE')(deviceDispatch);
            }}>
              <View style={styles.sm_icon_holder}>
                <FontAwesome size={30} name="home" style={[styles.sm_icons, {color: `${activeState === HOME ? colors.accent : 'gray'}`}]}/>
              </View>
              <Text style={[styles.textStyle, { color: `${activeState === HOME ? colors.accent : colors.black}` }]}>{HOME}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.devicesOpt, styles.smOpts, { backgroundColor: `${activeState === DEVICES ? '#f2f2f2' : 'white'}` }]} onPress={() => {
              navigation.navigate(DEVICES);
              setActiveState(DEVICES);
              devicesAction(DEVICES, 'ACTIVE_STATE')(deviceDispatch);
            }}>
              <View style={styles.sm_icon_holder}>
                <FontAwesome size={30} name="bluetooth-b" style={[styles.sm_icons, {color: `${activeState === DEVICES ? colors.accent : 'gray'}`}]}/>
              </View>
              <Text style={[styles.textStyle, { color: `${activeState === DEVICES ? colors.accent : colors.black}` }]}>{DEVICES}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.profileOpt, styles.smOpts, { backgroundColor: `${activeState === PROFILE ? '#f2f2f2' : 'white'}` }]} onPress={() => {
              navigation.navigate(PROFILE);
              setActiveState(PROFILE);
              devicesAction(PROFILE, 'ACTIVE_STATE')(deviceDispatch);
            }}>
              <View style={styles.sm_icon_holder}>
                <FontAwesome size={25} name="user-circle-o" style={[styles.sm_icons, {color: `${activeState === PROFILE ? colors.accent : 'gray'}`}]}/>
              </View>
              <Text style={[styles.textStyle, { color: `${activeState === PROFILE ? colors.accent : colors.black}` }]}>{PROFILE}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingsOpt, styles.smOpts, { backgroundColor: `${activeState === SETTINGS ? '#f2f2f2' : 'white'}` }]} onPress={() => {
              navigation.navigate(SETTINGS);
              setActiveState(SETTINGS);
              devicesAction(SETTINGS, 'ACTIVE_STATE')(deviceDispatch);
            }}>
              <View style={styles.sm_icon_holder}>
                <FontAwesome size={25} name="gear" style={[styles.sm_icons, {color: `${activeState === SETTINGS ? colors.accent : 'gray'}`}]}/>
              </View>
              <Text style={[styles.textStyle, { color: `${activeState === SETTINGS ? colors.accent : colors.black}` }]}>{SETTINGS}</Text>
            </TouchableOpacity>
            <View style={styles.hori_line}></View>
            <TouchableOpacity style={[styles.logoutOpt, styles.smOpts, { backgroundColor: 'white' }]} onPress={_ => {
              navigation.toggleDrawer();
              Alert.alert('Logout!', 'Are you sure you want to logout?', [
                {
                  text: 'Cancel',
                  onPress: () => { },
                },

                {
                  text: 'OK',
                  onPress: () => {
                    loginAction('LOGOUT')(authDispatch);
                  },
                },
              ]);

            }}>
              <View style={styles.sm_icon_holder}>
                <MaterialIcon size={25} name="logout" style={[styles.sm_icons]}/>
              </View>
              <Text style={[styles.textStyle]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </SMContainer>
      </SafeAreaView>
    )
}

export default SideMenu;