import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { GlobalContext } from '../../context/Provider';
import styles from './styles';
import devicesAction from '../../context/actions/devicesAction';
import { BleManager } from 'react-native-ble-plx';
import { scanningDevices } from '../../utils/helper';
import { requestLocationPermission } from '../../utils/permission';
import colors from '../../assets/themes/colors';

const Map = () => {
    const { deviceDispatch, deviceState: {devices} } = useContext(GlobalContext);
    const manager = new BleManager();
    const [loadDevices, setLoadDevices] = useState(null);

    useEffect(() => {
        scanDevices();
        return () => {
            console.log('Map unmounted')
        }
    }, []);

    const scanDevices = async() => {
        try{
            const permission = await requestLocationPermission();
            if(permission){
                scanningDevices(deviceDispatch, devicesAction, manager, renderAssets);
            }
        }catch(err){
            console.error('Error in scanDevices ', err);
        }
    };

    const renderAssets = () => {
        try{
            let assets = [];
            devices.forEach(device => {
                if(device.coords){
                    let coordsArr = device.coords.split(' ');
                    if(device.dType === 'beacon'){
                        // const interval = setInterval(async() => {
                            // if(device.isScanned){
                            //     manager.readRSSIForDevice(device.id).then((resp) => {
                            //         console.log('RSSI: ', resp);
                            //     }).catch((err) => {
                            //         console.log('Error: ', err);
                            //     })    
                            // }
                            
                        // }, 2000);
                        assets.push(
                            <TouchableOpacity key={device.id} style={[styles.tag_container, {top: parseInt(coordsArr[1]), left: parseInt(coordsArr[0])}]} onPress={() => {
                                let distance = 0;
                                if(device.rssi){
                                    let txpower = -77,
                                    n=2,
                                    delta = parseFloat(txpower - device.rssi)/(10*n);
                                    distance = 10^(delta);
                                }
                                Alert.alert(device.name, `Device Address: ${device.id} ${device.rssi ? `\nRSSI Value: ${device.rssi} \nDistance: ${distance}` : ''}`, [
                                    {
                                      text: 'Ok',
                                      onPress: () => {},
                                    }
                                ]);
                            }}>
                                <Image source={require('../../assets/images/assetPointer.gif')} style={styles.bp_img} tintColor={device.notLoaded ? 'lightgrey' : colors.beacon}
                                ></Image>
                            </TouchableOpacity>
                        )
                    }else{
                        // if(device.isScanned){
                            // manager.connectToDevice(device.id, {autoConnect:true}).then(data => {
                            //     console.log(data);
                            // }).catch(err => {
                            //     console.log('Error connecting: ', err);
                            // })
                            // manager.readRSSIForDevice(device.id).then((resp) => {
                            //     console.log('RSSI: ', resp);
                            // }).catch((err) => {
                            //     console.log('Error: ', err);
                            // })    
                        // }
                        assets.push(
                            <TouchableOpacity key={device.id} style={[styles.tag_container, {top: parseInt(coordsArr[1]), left: parseInt(coordsArr[0])}]} onPress={() => {
                                let distance = 0;
                                if(device.rssi){
                                    let txpower = -77,
                                    n=2,
                                    delta = parseFloat(txpower - device.rssi)/(10*n);
                                    distance = 10^(delta);
                                }
                                
                                Alert.alert(device.name, `Device Address: ${device.id} ${device.rssi ? `\nRSSI Value: ${device.rssi} \nDistance: ${distance}`  : ''}`, [
                                    {
                                      text: 'Ok',
                                      onPress: () => {},
                                    }
                                ]);
                            }} >
                                <Image source={require('../../assets/images/assetPointer.gif')} style={styles.ap_img} tintColor={device.notLoaded ? 'lightgrey' : colors.asset}></Image>
                            </TouchableOpacity>
                        )
                    }
                }
            });
            setLoadDevices(assets);
        }catch(err){
            console.error('Error in renderAssets ', err.stack);
        }
    }

    return(
        <View style={styles.mapContainer}>
            <View style={styles.mapHolder}>
                {loadDevices}
            </View>
        </View>
    )
}

export default Map;