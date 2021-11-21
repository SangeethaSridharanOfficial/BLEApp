import React, {useContext, useEffect, useState} from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { LOCATION, TEMPERATURE } from '../../constants/routeNames';
import {useNavigation} from '@react-navigation/native';
import styles from './styles';
import { GlobalContext } from '../../context/Provider';
import devicesAction from '../../context/actions/devicesAction';
import colors from '../../assets/themes/colors';

export default DeviceMenu = () => {
    const {navigate} = useNavigation();
    const { deviceDispatch, deviceState: {devicePos}} = useContext(GlobalContext);
    let viewEle = null;
    const [elePos, setElePos] = useState({width: 100});

    useEffect(() => {
        if(viewEle)
            viewEle.measure((ps, pt, width, height, x, y) => {
                setElePos({x, y, height, width});
            })
    }, [])

    const setDevicePosition = () => {
        try{
            devicesAction({open: false, dPos: {}, device: null}, 'DEVICE_HOLDER_COORDS')(deviceDispatch);
        }catch(err){
            console.error('Error in setDevicePosition ', err);
        }
    }

    const removeDevice = () => {
        try{
            devicesAction(devicePos.device, 'REMOVE_DEVICE')(deviceDispatch);
        }catch(err){
            console.error('Error in removeDevice ', err);
        }
    }

    return(
        <View style={[styles.menuItmHolder, {top: devicePos.dPos.y - 20, left: devicePos.dPos.width - elePos.width - 20}]} ref={view => {
            if(!view || viewEle) return;
            viewEle = view;
        }}>
            <TouchableOpacity style={[styles.closeIconHolder, styles.optHolder]} onPress={() => {
                removeDevice();
                setDevicePosition();
            }}>
                <Ionicon size={30} color={colors.accent} name="close" />
                <Text style={styles.optTxt}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.graphHolder, styles.optHolder]} onPress={() => {
                devicesAction(TEMPERATURE, 'ACTIVE_STATE')(deviceDispatch);
                devicesAction(false, 'UPDATE_DEVICE_MENU_POPUP')(deviceDispatch);
                navigate(TEMPERATURE);
            }}>
                <Entypo size={25} color={colors.accent} name="line-graph" />
                <Text style={styles.optTxt}>Temperature Graph</Text>
            </TouchableOpacity>
            {devicePos.device.dType !== 'beacon' ? <TouchableOpacity style={[styles.graphHolder, styles.optHolder]} onPress={() => {
                devicesAction(LOCATION, 'ACTIVE_STATE')(deviceDispatch);
                devicesAction(false, 'UPDATE_DEVICE_MENU_POPUP')(deviceDispatch);
                navigate(LOCATION);
            }}>
                <Entypo size={25} color={colors.accent} name="location" />
                <Text style={styles.optTxt}>Location</Text>
            </TouchableOpacity> : null}
        </View>
    )
}