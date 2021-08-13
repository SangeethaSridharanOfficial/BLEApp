import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { GlobalContext } from '../../context/Provider';
import styles from './styles';
import devicesAction from '../../context/actions/devicesAction';
import { BleManager } from 'react-native-ble-plx';
import { scanningDevices } from '../../utils/helper';
import { requestLocationPermission } from '../../utils/permission';

const Map = () => {
    const { deviceDispatch, deviceState: {devices} } = useContext(GlobalContext);
    const manager = new BleManager();

    useEffect(() => {
        // const interval = setInterval(async() => {
        //     const permission = await requestLocationPermission();
        //     if(permission){
        //         scanningDevices(deviceDispatch, devicesAction, manager);
        //     }
        // }, 2000);
        // return () => { 
        //     // clearInterval(interval);
        //     console.log('Came here')
        // }
    }, [])

    const renderAssets = () => {
        try{
            let assets = [];
            devices.forEach(device => {
                if(device.coords){
                    let coordsArr = device.coords.split(' ');
                    if(device.dType === 'beacon'){
                        assets.push(
                            <TouchableOpacity key={device.id} style={[styles.tag_container, {top: parseInt(coordsArr[1]), left: parseInt(coordsArr[0])}]} onPress={() => {
                                let distance = 0;
                                if(device.rssi){
                                    let txpower = -77,
                                    n=2,
                                    delta = parseFloat(txpower - device.rssi)/(10*n);
                                    distance = 10^(delta);
                                }
                                Alert.alert(device.name, `Device Address: ${device.id} ${device.rssi ? '\nRSSI Value: ' + distance : ''}`, [
                                    {
                                      text: 'Ok',
                                      onPress: () => {},
                                    }
                                ]);
                            }}>
                                <Image source={require('../../assets/images/beaconPointer.gif')} style={styles.bp_img} tintColor={device.notLoaded ? 'lightgrey' : ''}
                                ></Image>
                            </TouchableOpacity>
                        )
                    }else{
                        assets.push(
                            <TouchableOpacity key={device.id} style={[styles.tag_container, {top: parseInt(coordsArr[1]), left: parseInt(coordsArr[0])}]} onPress={() => {
                                let distance = 0;
                                if(device.rssi){
                                    let txpower = -77,
                                    n=2,
                                    delta = parseFloat(txpower - device.rssi)/(10*n);
                                    distance = 10^(delta);
                                }
                                
                                Alert.alert(device.name, `Device Address: ${device.id} ${device.rssi ? '\nRSSI Value: ' + distance : ''}`, [
                                    {
                                      text: 'Ok',
                                      onPress: () => {},
                                    }
                                ]);
                            }} >
                                <Image source={require('../../assets/images/assetPointer.gif')} style={styles.ap_img} tintColor={device.notLoaded ? 'lightgrey' : ''}></Image>
                            </TouchableOpacity>
                        )
                    }
                }
            });
            return assets;
        }catch(err){
            console.error('Error in renderAssets ', err.stack);
        }
    }

    return(
        <View style={styles.mapContainer}>
            <View style={styles.mapHolder}>
                {renderAssets()}
                {/* <Image source={require('../../assets/images/assetPointer.gif')} style={styles.assetPointer}></Image> */}
            </View>
        </View>
    )
}

export default Map;