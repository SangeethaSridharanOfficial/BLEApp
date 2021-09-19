import React, { useEffect, useState, useContext } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Image, Alert } from 'react-native';
import { GlobalContext } from '../../context/Provider';
import styles from './styles';
import devicesAction from '../../context/actions/devicesAction';
import { BleManager } from 'react-native-ble-plx';
import { scanningDevices } from '../../utils/helper';
import { requestLocationPermission } from '../../utils/permission';
import colors from '../../assets/themes/colors';
import loginAction from '../../context/actions/loginAction';
const manager = new BleManager();
import axiosInstance from '../../utils/axiosInstance';

const Map = () => {
    const { deviceDispatch, deviceState: {devices}, authDispatch, authState: {firstLoad} } = useContext(GlobalContext);
    const [loadDevices, setLoadDevices] = useState(null);
    const [dataLoading, setDataLoading] = useState(false);
    let timer;

    useEffect(() => {
        if(firstLoad){
            loginAction('FIRST_LOAD')(authDispatch);
            const subscription = manager.onStateChange(state => {
                if (state === "PoweredOn") {
                  subscription.remove();
                  scanDevices();
                }
            }, true);
        }else{
            renderAssets();
        }
        
        console.log('Map Mounted')
        
        return () => {
            console.log('Map unmounted')
            if(timer) clearTimeout(timer);
        }
    }, []);

    const scanDevices = async() => {
        try{
            const permission = await requestLocationPermission();
            if(permission){
                timer = scanningDevices(deviceDispatch, devicesAction, manager, renderAssets, 5000);
            }
        }catch(err){
            console.error('Error in scanDevices ', err);
        }
    };

    const trackMobileDevice = (devicesArr) => {
        try{
            let x1 = parseInt(devicesArr[0].coords.split(' ')[0]),
            y1 = parseInt(devicesArr[0].coords.split(' ')[1]),
            x2 = parseInt(devicesArr[1].coords.split(' ')[0]),
            y2 = parseInt(devicesArr[1].coords.split(' ')[1]),
            x3 = parseInt(devicesArr[2].coords.split(' ')[0]),
            y3 = parseInt(devicesArr[2].coords.split(' ')[1]),
            r1 = calcDistance(devicesArr[0].rssi),
            r2 = calcDistance(devicesArr[1].rssi),
            r3 = calcDistance(devicesArr[2].rssi);

            let A = 2*x2 - 2*x1,
            B = 2*y2 - 2*y1,
            C = r1**2 - r2**2 - x1**2 + x2**2 - y1**2 + y2**2,
            D = 2*x3 - 2*x2,
            E = 2*y3 - 2*y2,
            F = r2**2 - r3**2 - x2**2 + x3**2 - y2**2 + y3**2;
            
            let x = Math.round((C*E - F*B) / (E*A - B*D), 3),
            y = Math.round((C*D - A*F) / (B*D - A*E), 3);
            console.log("r2 in TrackDevice: ", r2)

            // x = 0
            // y = 0
            // print('error in trilateration')
            // print(x1,y1,x2,y2,x3,y3)
            return {x, y}
        }catch(err){
            console.error('Error in trackMobileDevice ', err);
        }
    }

    const calcDistance = (rssi) => {
        try{
            if(!rssi) rssi = 0;
            let txpower = -77,
            n=2,
            delta = parseFloat(txpower - rssi)/(10*n),
            dist = Math.pow(10, delta),
            distance = Number(dist.toFixed(2));

            return distance;
        }catch(err){
            console.error('Error in calcDistance ', err);
        }
    }

    const fetchLatestTagData = (id) => {
        try{
            return new Promise((resolve, reject) => {
                axiosInstance.get(`/azure/LatestItem?id=${id}`).then(resp => {
                    return resolve(resp.data);
                }).catch(err => {
                    return reject(err);
                }) 
            });
        }catch(err){
            console.error('Error in fetchLatestTagData ', err);
        }
    }

    const renderAssets = () => {
        try{
            let assets = [];
            let specialDevices = [];
            devices.forEach(device => {
                if(device.coords){
                    if(device.isSpecialDevice){
                        specialDevices.push(device);
                    }
                    let coordsArr = device.coords.split(' ');
                    if(device.dType === 'beacon'){
                        // if(device.isScanned){
                        //     manager.connectToDevice(device.id, {autoConnect:true}).then(data => {
                        //         console.log(data);
                        //         manager.readRSSIForDevice(device.id).then((resp) => {
                        //             console.log('RSSI: ', resp);
                        //         }).catch((err) => {
                        //             console.log('Error: ', err);
                        //         })  
                        //     }).catch(err => {
                        //         console.log('Error connecting: ', err);
                        //     })
                              
                        // }
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
                                if(dataLoading) return;
                                setDataLoading(true);
                                fetchLatestTagData(device.id).then(tagData => {
                                    setDataLoading(false);
                                    let {data} = tagData;
                                    let distance = 0;
                                    if(device.rssi){
                                        distance = calcDistance(device.rssi);
                                    }
                                    Alert.alert(device.name, `Device Address: ${device.id} ${device.rssi ? `\nRSSI Value: ${device.rssi} \nDistance: ${distance} \nTemperature: ${data.Temp}` : ''}`, [
                                        {
                                        text: 'Ok',
                                        onPress: () => {},
                                        }
                                    ]);
                                }).catch(err => {
                                    setDataLoading(false);
                                    console.log('ERROR ', err);
                                });
                                
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
                                if(dataLoading) return;
                                setDataLoading(true);
                                fetchLatestTagData(device.id).then(tagData => {
                                    let {data} = tagData;
                                    setDataLoading(false);
                                    let distance = 0;
                                    if(device.rssi){
                                        distance = calcDistance(device.rssi);
                                    }
                                    
                                    Alert.alert(device.name, `Device Address: ${device.id} ${device.rssi ? `\nRSSI Value: ${device.rssi} \nDistance: ${distance} \nTemperature: ${data.Temp} \nClickNo: ${data.ClickNo}`  : ''}`, [
                                        {
                                        text: 'Ok',
                                        onPress: () => {},
                                        }
                                    ]);
                                }).catch(err => {
                                    setDataLoading(false);
                                    console.log('ERROR ', err);
                                });
                                
                            }} >
                                <Image source={require('../../assets/images/assetPointer.gif')} style={styles.ap_img} tintColor={device.notLoaded ? 'lightgrey' : colors.asset}></Image>
                            </TouchableOpacity>
                        )
                    }
                }
            });
            if(specialDevices.length === 3){

                // Calculate for mobile
                let mobileCoords = trackMobileDevice(specialDevices);

                assets.push(
                    <TouchableOpacity key={'mobileDevice'} style={[styles.tag_container, {top: parseInt(mobileCoords.y), left: parseInt(mobileCoords.x)}]} onPress={() => {
                        
                        // Alert.alert(device.name, `Device Address: ${device.id} ${device.rssi ? `\nRSSI Value: ${device.rssi} \nDistance: ${distance}`  : ''}`, [
                        //     {
                        //       text: 'Ok',
                        //       onPress: () => {},
                        //     }
                        // ]);
                    }} >
                        <Image source={require('../../assets/images/assetPointer.gif')} style={styles.ap_img} tintColor={colors.mobile}></Image>
                    </TouchableOpacity>
                )
            }
            setLoadDevices(assets);
        }catch(err){
            console.error('Error in renderAssets ', err);
        }
    }

    return(
        <View style={styles.mapContainer}>
            {dataLoading ? <View pointerEvents="none" style={styles.dt_loading_cont}>
                <ActivityIndicator color={'teal'} size={35} />
            </View> : null}
            {loadDevices ? <View style={styles.mapHolder}>
                {loadDevices}
            </View> : 
            <View style={styles.loaderContainer}>
                <ActivityIndicator color={'teal'} size={25} />
            </View>}
        </View>
    )
}

export default Map;