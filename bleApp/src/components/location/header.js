import React, { useContext, useEffect } from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import { DEVICES } from '../../constants/routeNames';
import { GlobalContext } from '../../context/Provider';
import devicesAction from '../../context/actions/devicesAction';

export default LocHeader = ({navigate}) => {
    const { deviceState: {devicePos}, deviceDispatch } = useContext(GlobalContext);

    return(
        <View style={styles.hCont}>
            <TouchableOpacity style={styles.backBtnHolder} onPress={() => {
                devicesAction({open: false, dPos: {}, device: null}, 'DEVICE_HOLDER_COORDS')(deviceDispatch);
                devicesAction(DEVICES, 'ACTIVE_STATE')(deviceDispatch);
                navigate(DEVICES);
            }}>
                <Ionicon size={30} name="arrow-back"/>
                <View style={styles.locTxtHolder}>
                    <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.locTxt, styles.txtStyle]}>Location</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.dNameHolder}>
                <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.dNameTxt, styles.txtStyle]}>{`${devicePos.device.name}`}</Text>
            </View>
            <TouchableOpacity style={styles.refreshHolder}>
                <Ionicon size={30} name="refresh" />
            </TouchableOpacity>
        </View>
    )
}