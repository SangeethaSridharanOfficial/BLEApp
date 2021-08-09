import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { GlobalContext } from '../../context/Provider';
import styles from './styles';

const Map = () => {
    const { deviceDispatch, deviceState: {devices} } = useContext(GlobalContext);

    const renderAssets = () => {
        try{
            let assets = [];
            devices.forEach(device => {
                if(device.coords){
                    let coordsArr = device.coords.split(' ');
                    if(device.dType === 'beacon'){
                        assets.push(
                            <TouchableOpacity key={device.id} style={[styles.tag_container, {top: parseInt(coordsArr[1]), left: parseInt(coordsArr[0])}]} onPress={() => {
                                Alert.alert(device.name, `Device Address: ${device.id} ${device.rssi ? '\nRSSI Value: ' + device.rssi : ''}`, [
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
                                Alert.alert(device.name, `Device Address: ${device.id} ${device.rssi ? '\nRSSI Value: ' + device.rssi : ''}`, [
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