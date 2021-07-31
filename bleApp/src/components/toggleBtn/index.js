import React, { useEffect, useState, useContext } from 'react';
import { Button, View } from 'react-native';
import styles from './styles';
import { GlobalContext } from '../../context/Provider';

const ToggleBtn = ({handleDevice, device, isAdded}) => {
    const [btnName, setBtnName] = useState('Add');
    const [deviceId, setDeviceId] = useState('');
    const { deviceDispatch, deviceState: {coords}} = useContext(GlobalContext);

    useEffect(() => {
        if(device.id === deviceId && device.coords){
            setBtnName('Remove');
            setDeviceId('');
        }else if(device.id === deviceId && !device.coords){
            setBtnName('Add');
        }
    }, [coords]);

    useEffect(() => {
        if(isAdded){
            setBtnName('Remove');
        }
    }, [])

    const _onPress = () => {
        try{
            if(btnName === 'Remove'){
                setBtnName('Add');
            }
            setDeviceId(device.id);
            handleDevice(btnName.toUpperCase());
        }catch(err){
            console.error('Error in _onPress ', err.stack);
        }
    }

    return(
        <View style={styles.toggleBtn}>
            <Button title={btnName} onPress={e => _onPress(device, e)} />
        </View>
    )
}

export default ToggleBtn;