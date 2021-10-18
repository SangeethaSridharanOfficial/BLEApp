import React, { useEffect, useState, useContext } from 'react';
import ToggleBtn from '../toggleBtn/index';
import { View, Text, TouchableOpacity } from 'react-native';
import { GlobalContext } from '../../context/Provider';
import devicesAction from '../../context/actions/devicesAction';
import styles from './styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../../assets/themes/colors';

export default Device = ({device, handleToggle, isAdded, initCoords}) => {
    const { deviceDispatch, deviceState: {coords, devicePos}} = useContext(GlobalContext);
    const [deviceCoords, setDeviceCoords] = useState(null);
    const [isSpecialDevice, setisSpecialDevice] = useState(false);
    const [deviceId, setDeviceId] = useState('');
    let viewEle = null;

    useEffect(() => {
        if(device.id === deviceId && coords){
            setisSpecialDevice(device.isSpecialDevice);
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
            setisSpecialDevice(false);
        }
    }, [coords]);

    useEffect(() => {
        setisSpecialDevice(device.isSpecialDevice);
        if(initCoords){
            setDeviceCoords(initCoords);
        }
    }, []);

    const handleDevice = (async (type) => {
        try{
            if(type === 'REMOVE'){
                devicesAction({cordinatesVal: '', currentDevice: device, dType: device.dType}, 'SET_COORDS')(deviceDispatch);
                setDeviceCoords(null);
                setisSpecialDevice(false);
            }
            handleToggle(device, type);
            setDeviceId(device.id);
        }catch(err){
            console.error('Error in handleDevice ', err);
        }
    });

    const setDevicePosition = (dPos) => {
        try{
            devicesAction({open: true, dPos, device}, 'DEVICE_HOLDER_COORDS')(deviceDispatch);
        }catch(err){
            console.error('Error in setDevicePosition ', err.stack);
        }
    }

    return(
        <View ref={view => {
                if(!view || viewEle) return;
                viewEle = view;
            }} style={[styles.deviceHolder, {backgroundColor: `${device.isScanned ? colors.grey : 'lightgrey'}`}]} key={device.id}>
            <TouchableOpacity style={styles.menuOptBtn} onPress={() => {
                if(viewEle && (!devicePos.open || devicePos.device.id !== device.id)){
                    viewEle.measure((ps, pt, width, height, x, y) => {
                        setDevicePosition({x, y, height, width});
                    })
                }else{
                    devicesAction({open: false, dPos: {}, device: {}}, 'DEVICE_HOLDER_COORDS')(deviceDispatch);
                }
            }}>
                <Entypo size={30}  name="dots-three-vertical" />
            </TouchableOpacity>
            <ToggleBtn handleDevice={handleDevice} isAdded={isAdded} device={device} changeToAdd={initCoords ? true : false}/>
            {isSpecialDevice ? <View style={styles.specialDeviceCont}>
                <MaterialIcon size={30} name="mobile-friendly" />
            </View> : null}
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