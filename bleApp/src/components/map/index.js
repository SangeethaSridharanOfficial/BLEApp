import React, { useEffect, useState, useContext } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Image, Alert, Text } from 'react-native';
import { GlobalContext } from '../../context/Provider';
import styles from './styles';
import devicesAction from '../../context/actions/devicesAction';
import { BleManager } from 'react-native-ble-plx';
import { scanningDevices } from '../../utils/helper';
import { requestLocationPermission } from '../../utils/permission';
import colors from '../../assets/themes/colors';
import loginAction from '../../context/actions/loginAction';
let manager = new BleManager();
import axiosInstance from '../../utils/axiosInstance';
import { SearchBar } from 'react-native-elements';

const Map = () => {
    const { deviceDispatch, deviceState: {devices, mapHolderPos}, authDispatch, authState: {firstLoad, data: {role}} } = useContext(GlobalContext);
    const [loadDevices, setLoadDevices] = useState(null);
    const [dataLoading, setDataLoading] = useState(false);
    let interval = null, scannedDevicesArr = [], updatedRssi = {};
    const [search, setSearch] = useState('');
    var [mapHolderPost, setmapHolderPost] = useState(null);

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
            processMapView();
        }
        
        return () => {
            console.log('Map unmounted ');
            updatedRssi = {};
            scannedDevicesArr = [];
            if(interval) clearInterval(interval);
        }
    }, []);

    useEffect(() => {
        if(!mapHolderPos) devicesAction(mapHolderPost, 'UPDATE_MAP_HOLDER_ELEMENT')(deviceDispatch);
    }, [mapHolderPost])

    const processMapView = () => {
        try{
            interval = setInterval(() => {
                scannedDevicesArr.forEach(async(id) => {
                    let isConnected = await manager.isDeviceConnected(id);
                    console.log('isConnected ', isConnected);
                    if(isConnected){
                        manager.readRSSIForDevice(id).then((resp) => {
                            console.log('RSSI: ', resp.rssi);
                            updatedRssi[id] = resp.rssi;
                            renderAssets();
                        }).catch((err) => {
                            console.log('Error: ', err);
                        })  
                    }else{
                        manager.connectToDevice(id, {autoConnect:true}).then(data => {
                            manager.readRSSIForDevice(id).then((resp) => {
                                console.log('RSSI: ', resp.rssi);
                                updatedRssi[id] = resp.rssi;
                                renderAssets();
                            }).catch((err) => {
                                console.log('Error: ', err);
                            })  
                        }).catch(err => {
                            console.log('Error connecting: ', err);
                        })
                    }
                })
            }, 10000)     
        }catch(err){
            console.error('Error in processMapView ', err);
        }
    }

    const scanDevices = async() => {
        try{
            const permission = await requestLocationPermission();
            if(permission){
                scanningDevices(deviceDispatch, devicesAction, manager, renderAssets, 5000, processMapView);
            }
        }catch(err){
            console.error('Error in scanDevices ', err);
        }
    };

    const trackMobileDevice = (devicesArr) => {
        try{
            let r1 = calcDistance(devicesArr[0].rssi),
            r2 = calcDistance(devicesArr[1].rssi),
            r3 = calcDistance(devicesArr[2].rssi);
            if(updatedRssi[devicesArr[0].id]){
                let rssi = devicesArr[0].rssi + updatedRssi[devicesArr[0].id];
                    rssi = rssi/2;
                r1 = calcDistance(rssi);
            }
            if(updatedRssi[devicesArr[1].id]){
                let rssi = devicesArr[1].rssi + updatedRssi[devicesArr[1].id];
                    rssi = rssi/2;
                r2 = calcDistance(rssi);
            }
            if(updatedRssi[devicesArr[2].id]){
                let rssi = devicesArr[2].rssi + updatedRssi[devicesArr[2].id];
                    rssi = rssi/2;
                r3 = calcDistance(rssi);
            }
            let x1 = parseInt(devicesArr[0].coords.split(' ')[0]),
            y1 = parseInt(devicesArr[0].coords.split(' ')[1]),
            x2 = parseInt(devicesArr[1].coords.split(' ')[0]),
            y2 = parseInt(devicesArr[1].coords.split(' ')[1]),
            x3 = parseInt(devicesArr[2].coords.split(' ')[0]),
            y3 = parseInt(devicesArr[2].coords.split(' ')[1]);

            // x1 = 100, y1 = 200, x2 = 300, y2 = 200, x3 = 100, y3 = 400;
            // r1 = 141, r2 = 141, r3 = 141;

            let A = 2*x2 - 2*x1,
            B = 2*y2 - 2*y1,
            C = Math.pow(r1, 2) - Math.pow(r2,2) - Math.pow(x1,2) + Math.pow(x2,2) - Math.pow(y1,2) + Math.pow(y2,2),
            D = 2*x3 - 2*x2,
            E = 2*y3 - 2*y2,
            F = Math.pow(r2,2) - Math.pow(r3,2) - Math.pow(x2,2) + Math.pow(x3,2) - Math.pow(y2,2) + Math.pow(y3,2);
            
            let x = (C*E - F*B) / (E*A - B*D),
            y = (C*D - A*F) / (B*D - A*E);
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
            if(!rssi) return 1.0;
            let txpower = -77,
            n=2,
            delta = parseFloat(txpower - rssi)/(10*n),
            dist = Math.pow(10, delta),
            distance = Number(dist.toFixed(2));
            // distance = distance * 6;
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

    const renderAssets = (searchedName = '') => {
        try{
            let assets = [];
            let specialDevices = [];
            devices.forEach(device => {
                if(device.coords){
                    if(device.isSpecialDevice && specialDevices.length < 3){
                        specialDevices.push(device);
                    }
                    let coordsArr = device.coords.split(' ');
                    if(device.dType === 'beacon'){
                        if(device.isScanned){
                            if(scannedDevicesArr.indexOf(device.id) === -1)
                                scannedDevicesArr.push(device.id);
                        }
                        assets.push(
                            <TouchableOpacity key={device.id} style={[styles.tag_container, {top: parseInt(coordsArr[1]), left: parseInt(coordsArr[0])}]} onPress={() => {
                                if(dataLoading || role === 'visitor') return;
                                setDataLoading(true);
                                fetchLatestTagData(device.id).then(tagData => {
                                    setDataLoading(false);
                                    let {data} = tagData;
                                    let distance = 0;
                                    if(device.rssi){
                                        if(updatedRssi[device.id]){
                                            let rssi = device.rssi + updatedRssi[device.id];
                                            rssi = rssi/2;
                                            distance = calcDistance(rssi);
                                        }else{
                                            distance = calcDistance(device.rssi);
                                            updatedRssi[device.id] = device.rssi;
                                        }
                                    }
                                    let temp = 0, time, date;
                                    if(Object.keys(data).length){
                                        temp = data.Temp;
                                        if(data.timestamp){
                                            time = data.timestamp.split('T')[1].split('.')[0];
                                            date = data.timestamp.split('T')[0];
                                        }
                                        
                                    }
                                    Alert.alert(device.name, `Device Address: ${device.id} ${device.rssi ? `\nRSSI Value: ${updatedRssi[device.id] ? updatedRssi[device.id] : device.rssi} \nDistance: ${distance} ${Object.keys(data).length ? `\nTemperature: ${temp} ${time ? `\nDate: ${date} \nTime: ${time}` : ''}` : ''}` : ''}`, [
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
                               {(device.name.toLowerCase() === searchedName.toLowerCase()) ? <View style={[styles.dNameCont]}>
                                    <Text style={styles.dNameTxt}>{device.name}</Text>
                                </View> : null}
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
                                if(dataLoading || role === 'visitor') return;
                                setDataLoading(true);
                                fetchLatestTagData(device.id).then(tagData => {
                                    let {data} = tagData;
                                    setDataLoading(false);
                                    let distance = 0;
                                    if(updatedRssi[device.id]){
                                        let rssi = device.rssi + updatedRssi[device.id];
                                            rssi = rssi/2;
                                        distance = calcDistance(rssi);
                                    }else{
                                        distance = calcDistance(device.rssi);
                                        updatedRssi[device.id] = device.rssi;
                                    }

                                    let temp = 0, time, date;
                                    if(Object.keys(data).length){
                                        temp = data.Temp;
                                        if(data.timestamp){
                                            time = data.timestamp.split('T')[1].split('.')[0];
                                            date = data.timestamp.split('T')[0];
                                        }
                                    }
                                    
                                    Alert.alert(device.name, `Device Address: ${device.id} ${device.rssi ? `\nRSSI Value: ${updatedRssi[device.id] ? updatedRssi[device.id] : device.rssi} \nDistance: ${distance} ${Object.keys(data).length ? `\nTemperature: ${data.Temp}  \nClickNo: ${data.ClickNo} ${time ? `\nDate: ${date} \nTime: ${time}` : ''}` : ''}` : ''}`, [
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
                                {(device.name.toLowerCase() === searchedName.toLowerCase()) ? <View style={[styles.dNameCont]}>
                                    <Text style={styles.dNameTxt}>{device.name}</Text>
                                </View> : null}
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
                        Alert.alert('Mobile Device', `X:${mobileCoords.x} \nY: ${mobileCoords.y}`, [
                            {
                              text: 'Ok',
                              onPress: () => {},
                            }
                        ]);
                    }} >
                        <Image source={require('../../assets/images/mobile.gif')} style={styles.mobile_img}></Image>
                    </TouchableOpacity>
                )
            }
            setLoadDevices(assets);
        }catch(err){
            console.error('Error in renderAssets ', err);
        }
    }

    return(
        <View>
            <SearchBar containerStyle={{backgroundColor: 'white'}} style={styles.searchCont} 
                inputContainerStyle={{backgroundColor: 'white'}}
                placeholder="Search.."
                onChangeText={(val) => {setSearch(val); renderAssets(val)}}
                value={search}
            />
            <View style={styles.mapContainer}>
                {dataLoading ? <View pointerEvents="none" style={styles.dt_loading_cont}>
                    <ActivityIndicator color={'teal'} size={35} />
                </View> : null}
                {loadDevices ? <View style={styles.mapHolder} ref={view => {
                    if(!view) return;
                    view.measure((ps, pt, width, height, x, y) => {
                        setmapHolderPost({x, y, height, width})
                    })
                    
                }}>
                    {loadDevices}
                </View> : 
                <View style={styles.loaderContainer}>
                    <ActivityIndicator color={'teal'} size={25} />
                </View>}
            </View>
        </View>
    )
}

export default Map;