import React, { useEffect, useState, useContext } from 'react';
import ToggleBtn from '../toggleBtn/index';
import { View, Text, TouchableOpacity } from 'react-native';
import { GlobalContext } from '../../context/Provider';
import devicesAction from '../../context/actions/devicesAction';
import styles from './styles';
import Ionicon from 'react-native-vector-icons/Ionicons';
import colors from '../../assets/themes/colors';

const Device = ({device, handleToggle, isAdded, initCoords}) => {
    const { deviceDispatch, deviceState: {coords}} = useContext(GlobalContext);
    const [deviceCoords, setDeviceCoords] = useState(null);
    const [deviceId, setDeviceId] = useState('');

    useEffect(() => {
        if(device.id === deviceId && coords){
            if(device.coords){
                setDeviceCoords(device.coords);
            }else{
                setDeviceCoords(null)
            }
            setDeviceId('');
            devicesAction({cordinatesVal: '', currentDevice: null}, 'SET_COORDS')(deviceDispatch);
        }else if(device.id === deviceId && !coords){
            setDeviceCoords(null);
            setDeviceId('');
        }
    }, [coords]);

    useEffect(() => {
        if(initCoords){
            setDeviceCoords(initCoords);
        }
    }, []);

    const handleDevice = (async (type) => {
        try{
            if(type === 'REMOVE'){
                devicesAction({cordinatesVal: '', currentDevice: device}, 'SET_COORDS')(deviceDispatch);
                setDeviceCoords(null);
            }
            handleToggle(device, type);
            setDeviceId(device.id);
        }catch(err){
            console.error('Error in handleDevice ', err);
        }
    });

    const removeDevice = () => {
        try{
            devicesAction(device, 'REMOVE_DEVICE')(deviceDispatch);
        }catch(err){
            console.error('Error in removeDevice ', err.stack);
        }
    }

    return(
        <View style={[styles.deviceHolder, {backgroundColor: `${device.isScanned ? colors.grey : 'lightgrey'}`}]} key={device.id}>
            <TouchableOpacity style={styles.closeIcon} onPress={removeDevice}>
                <Ionicon size={35} name="close" />
            </TouchableOpacity>
            <ToggleBtn handleDevice={handleDevice} isAdded={isAdded} device={device} changeToAdd={initCoords ? true : false}/>
            <View style={styles.info}>
                <Text>{device.id}</Text>
                <View style={styles.subInfo}>
                    <Text>{device.name}</Text>
                    {deviceCoords && <Text style={styles.coords}>{deviceCoords}</Text>}
                </View>
            </View>
        </View>
    )
}

export default Device;