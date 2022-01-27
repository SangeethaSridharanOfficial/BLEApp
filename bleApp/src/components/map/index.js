import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Alert, ImageBackground } from 'react-native';
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
import { Dimensions } from "react-native";
import { SearchBar } from 'react-native-elements';
import { VictoryChart, VictoryScatter, VictoryZoomContainer, VictoryLabel, VictoryAxis } from "victory-native";
import {Text, Svg, Circle, Marker} from "react-native-svg";

var assetTimer = null, interval = null;
var TAG_DATA = [], isUnmounted = false;

let circleCount = 0;

const TouchableCircle = (props) => {
    circleCount++;
    const circlePressed = () => {
      props.onPress(props.pointValue);
    }
    let color = props.pointValue.dType === 'beacon' ? colors.beacon : colors.asset;
    if( props.pointValue.notLoaded ) color = 'lightgrey';
    if(props.pointValue.name === 'mobile') color = colors.mobile
  
    return (
        <Circle cx={props.cx} cy={props.cy} r={props.r} strokeWidth={2} fill={color} onPressIn={circlePressed}/>
    );
  }
const DataPoint = ({ x, y, data, updatedRssi, calcDistance, role, fetchLatestTagData, setDataLoading, dataLoading }) => {

    const handleClick = (props) => {
        if(props.name === 'mobile'){
            Alert.alert('Mobile Device', `X:${props.x*20} \nY: ${props.y *20}`, [
                {
                  text: 'Ok',
                  onPress: () => {},
                }
            ]);
            return;
        }
        if(dataLoading || role === 'visitor') return;

        setDataLoading(true);
        fetchLatestTagData(props.id).then(tagData => {
            setDataLoading(false);
            let {data} = tagData;
            let distance = 0;
            if(props.rssi){
                if(updatedRssi[props.id]){
                    let rssi = props.rssi + updatedRssi[props.id];
                    rssi = rssi/2;
                    distance = calcDistance(rssi);
                }else{
                    distance = calcDistance(props.rssi);
                    updatedRssi[props.id] = props.rssi;
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
            
            if(props.dType === 'beacon'){
                Alert.alert(props.name, `Device Address: ${props.id} ${props.rssi ? `\nRSSI Value: ${updatedRssi[props.id] ? updatedRssi[props.id] : props.rssi} \nDistance: ${distance} ${Object.keys(data).length ? `\nTemperature: ${temp} ${time ? `\nDate: ${date} \nTime: ${time}` : ''}` : ''}` : ''}`, [
                    {
                    text: 'Ok',
                    onPress: () => {},
                    }
                ]);
            }else{
                Alert.alert(props.name, `Device Address: ${props.id} \nDistance: ${distance} ${Object.keys(data).length ? `\nTemperature: ${data.Temp}  \nClickNo: ${data.ClickNo} ${time ? `\nDate: ${date} \nTime: ${time}` : ''}` : ''}`, [
                    {
                    text: 'Ok',
                    onPress: () => {},
                    }
                ]);
            }
            
            
        }).catch(err => {
            setDataLoading(false);
            console.error('ERROR ', err);
        });
    }

    return (
        <TouchableCircle cx={x} cy={y} r={'7'} pointValue={data[circleCount]} onPress={handleClick}/>
    )
}

const DataLabel = props => {
    const x = props.scale.x(props.x);
    const y = props.scale.y(props.y);
    return <VictoryLabel lineHeight={3} {...props} x={x - 25} y={y - 20} style={{fill: colors.accent, fontSize: 20, fontWeight: 'bold'}}/>
};

const Map = () => {
    const { deviceDispatch, deviceState: {devices, mapHolderPos}, authDispatch, authState: {firstLoad, data: {role}} } = useContext(GlobalContext);
    const [loadDevices, setLoadDevices] = useState(null);
    const [dataLoading, setDataLoading] = useState(false);
    let deviceObj = {};
    let scannedDevicesArr = [], updatedRssi = {};
    const [search, setSearch] = useState('');
    var [mapHolderPost, setmapHolderPost] = useState(null);
    const [deviceLoading, setDeviceLoading] = useState(false);
    

    useEffect(() => {
        isUnmounted = false;
        circleCount = 0;
        setDeviceLoading(true);
        if(!firstLoad){
            initialDeviceData();
            let assetIds = [];
            devices.forEach(dev => {
                if(dev.name && dev.name.toLowerCase().includes('asset') && dev.isAdded){
                    assetIds.push(dev.id);
                }
            })
            if(assetIds.length){
                getAssetLocationWithTimer(assetIds);
            }
            renderTags();
            processMapView();
        }
        return () => {
            console.log('Map unmounted ', assetTimer, interval);
            updatedRssi = {};
            scannedDevicesArr = [];
            Object.keys(deviceObj).forEach(key => {
                let dObj = deviceObj[key];
                if( dObj.dType && dObj.dType !== 'beacon' ){
                    devicesAction({isAdded: true, cordinatesVal: dObj.coords, isSpecialDevice: dObj.isSpecialDevice, id: key, dType: dObj.dType}, 'SET_COORDS')(deviceDispatch);
                }
            })
            
            if(interval) clearInterval(interval);
            clearInterval(assetTimer);
            TAG_DATA = [];
            isUnmounted = true;
        }
    }, []);

    useEffect(() => {
        if(!mapHolderPos && mapHolderPost && mapHolderPost.height) {
            devicesAction(mapHolderPost, 'UPDATE_MAP_HOLDER_ELEMENT')(deviceDispatch);
            if(firstLoad){
                loginAction('FIRST_LOAD')(authDispatch);
                const subscription = manager.onStateChange(state => {
                    if (state === "PoweredOn") {
                      subscription.remove();
                      scanDevices();
                    }
                }, true);
            }
        }
    }, [mapHolderPost])

    const processMapView = () => {
        try{
            interval = setInterval(() => {
                if(isUnmounted) {
                    clearInterval(interval);
                    return;
                };
                scannedDevicesArr.forEach(async(id) => {
                    let isConnected = await manager.isDeviceConnected(id);
                    console.log('isConnected ', isConnected);
                    if(isConnected){
                        manager.readRSSIForDevice(id).then((resp) => {
                            updatedRssi[id] = resp.rssi;
                            renderTags();
                        }).catch((err) => {
                            console.log('Error: ', err);
                        })  
                    }else{
                        manager.connectToDevice(id, {autoConnect:true}).then(data => {
                            manager.readRSSIForDevice(id).then((resp) => {
                                updatedRssi[id] = resp.rssi;
                                renderTags();
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
                scanningDevices(deviceDispatch, devicesAction, manager, 10000).then(_ => {
                    let assetIds = [];
                    devices.forEach(dev => {
                        if(dev.name && dev.name.toLowerCase().includes('asset') && dev.isAdded){
                            assetIds.push(dev.id);
                        }
                    })
                    // assetIds = ["da:6a:f3:e4:58:7f", "ef:e3:f2:81:8e:08"]
                    initialDeviceData();
                    if(assetIds.length){
                        let newObj = deviceObj;
                        fetchLocationData(assetIds).then(resp => {
                            assetIds.forEach((id, idx) => {
                                Object.keys(deviceObj).forEach(d => {
                                    if(d === id && resp.data[idx]){
                                        newObj[d].coords = `${resp.data[idx].x} ${resp.data[idx].y}`;
                                    }
                                })
                            
                            })
                            deviceObj = newObj
                            getAssetLocationWithTimer(assetIds);
                            renderTags();
                            processMapView();
                        })
                    }else{
                        renderTags();
                        processMapView();
                    }
                    
                }).catch(_ => {
                    console.error("Error while scanning ");
                })
            }
        }catch(err){
            console.error('Error in scanDevices ', err);
        }
    };

    const getAssetLocationWithTimer = (assetIds) => {
        try{
            assetTimer = setInterval(() => {
                if(isUnmounted) {
                    clearInterval(assetTimer);
                    return;
                };
                fetchLocationData(assetIds).then(resp => {
                    let newObj = deviceObj;
                    assetIds.forEach((id, idx) => {
                        Object.keys(deviceObj).forEach(d => {
                            if(d === id && resp.data[idx].id === id){
                                newObj[d].coords = `${resp.data[idx].x} ${resp.data[idx].y}`;
                            }
                        })
                    })
                    deviceObj = newObj;
                    renderTags();
                }).catch(err => {
                    console.error('error in fetchLocation ', err);
                })
            }, 60000);
        }catch(err){
            console.error('Error in getAssetLocationWithTimer ', err);
        }
    }

    const fetchLocationData = (assetIds) => {
        try{
            return new Promise((resolve, reject) => {
                axiosInstance.post(`/azure/location/assetsloc`, {assetIds}).then(resp => {
                    return resolve(resp.data);
                }).catch(err => {
                    return reject(err);
                }) 
            });
        }catch(err){
            console.error('Error in fetchLocationData ', err);
        }
    }

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
            let x1 = parseInt(devicesArr[0].coords.split(' ')[0])/20,
            y1 = parseInt(devicesArr[0].coords.split(' ')[1])/20,
            x2 = parseInt(devicesArr[1].coords.split(' ')[0])/20,
            y2 = parseInt(devicesArr[1].coords.split(' ')[1])/20,
            x3 = parseInt(devicesArr[2].coords.split(' ')[0])/20,
            y3 = parseInt(devicesArr[2].coords.split(' ')[1])/20;

            

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
            console.log('mob ', x, y)
            return {x, y}
        }catch(err){
            console.error('Error in trackMobileDevice ', err);
        }
    }

    const calcDistance = (rssi) => {
        try{
            if(!rssi) return 1.0;
            let txpower = -69,
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

    const initialDeviceData = () => {
        try{
            let dData = {};
            devices.forEach(dObj => {
                if(dObj.isAdded){
                    dData[dObj.id] = {
                        name: dObj.name,
                        dType: dObj.dType,
                        isSpecialDevice: dObj.isSpecialDevice,
                        coords: dObj.coords,
                        rssi: dObj.rssi,
                        notLoaded: dObj.notLoaded
                    }
                    if(dObj.dType === 'beacon'){
                        if(dObj.isScanned){
                            if(scannedDevicesArr.indexOf(dObj.id) === -1)
                                scannedDevicesArr.push(dObj.id);
                        }
                    }
                }
            })

            deviceObj = dData;
        }catch(err){
            console.error("Error in initialDeviceData ", err);
        }
    }

    const renderTags = (searchText = "") => {
        try{
            let specialDevices = [];
            Object.keys(deviceObj).forEach(key => {
                if(devices.find(dev => dev.id === key).isAdded){
                    let dObj = deviceObj[key];
                    dObj['id'] = key;
                    if(dObj.isSpecialDevice){
                        specialDevices.push(dObj);
                    }
                    if(dObj.coords){
                        let axis = dObj.coords.split(' ');
                        TAG_DATA.push({
                            x: parseInt(axis[0]),
                            y: parseInt(axis[1]),
                            ...dObj
                        })
                    }
                }
                
            })

            if(specialDevices.length === 3){
                let mobileCoords = trackMobileDevice(specialDevices);
                TAG_DATA.push({
                    x: mobileCoords.x,
                    y: mobileCoords.y,
                    name: 'mobile'
                })
            }
            

            let searchVal = null;
            let maxWid = 10, maxHei = 10;

            TAG_DATA.forEach((v, i) => {
                if(searchText && searchText.toLowerCase() === v.name.toLowerCase()){
                    searchVal = {
                        x: v.x,
                        y: v.y,
                        text: v.name
                    }
                }

                if(maxWid < Math.abs(v.x)) maxWid = Math.abs(v.x) 
                if(maxHei < Math.abs(v.y)) maxHei = Math.abs(v.y) 
            })
            
            let hei = mapHolderPos ? mapHolderPos.height : mapHolderPost.height,
            wid = mapHolderPos ? mapHolderPos.width : mapHolderPost.width;

            console.log("width ", wid, hei);
            // maxWid = Math.round((wid-20)/2);
            // maxHei = Math.round((hei-50)/2);
            maxHei = (hei/wid) * 50;
            console.log("Max Height ", maxHei);
            if(searchVal){
                setLoadDevices(<Svg>
                    <VictoryChart padding={5} domainPadding={{ y: 5, x: 5 }}
                        domain={{ x: [50, -50], y: [maxHei, -maxHei] }}
                         height={hei}
                         width={wid}>
                        <VictoryAxis style={{ 
                            axis: {stroke: "transparent"}, 
                            ticks: {stroke: "transparent"},
                            tickLabels: { fill:"transparent"} 
                        }} />
                        <VictoryScatter
                            data={TAG_DATA}
                            dataComponent={<DataPoint calcDistance={calcDistance} updatedRssi={updatedRssi} role={role} fetchLatestTagData={fetchLatestTagData} setDataLoading={setDataLoading} dataLoading={dataLoading}  />} />
                        <DataLabel
                            x={searchVal.x}
                            y={searchVal.y}
                            text={searchVal.text}
                        />
                    </VictoryChart>
                </Svg>)
            }else{
                setLoadDevices(<Svg>
                    <VictoryChart padding={5} domainPadding={{ y: 10, x: 10}}
                        domain={{ x: [50, -50], y: [maxHei, -maxHei] }}
                         height={hei}
                         width={wid}>
                        <VictoryAxis style={{ 
                            axis: {stroke: "transparent"}, 
                            ticks: {stroke: "transparent"},
                            tickLabels: { fill:"transparent"} 
                        }} />
                        <VictoryScatter
                            data={TAG_DATA}
                            dataComponent={<DataPoint calcDistance={calcDistance} updatedRssi={updatedRssi} role={role} fetchLatestTagData={fetchLatestTagData} setDataLoading={setDataLoading} dataLoading={dataLoading} />} />
                    </VictoryChart>
                </Svg>)
            }
            circleCount = 0;
            setDeviceLoading(false);
        }catch(err){
            console.error("Error in renderTags[Map] ", err);
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
                        // if(device.isScanned){
                        //     if(scannedDevicesArr.indexOf(device.id) === -1)
                        //         scannedDevicesArr.push(device.id);
                        // }
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
                                    console.error('ERROR ', err);
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
                                    console.error('ERROR ', err);
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
                    <TouchableOpacity key={'mobileDevice'} style={[styles.tag_container, {top: parseInt(mobileCoords.y*20), left: parseInt(mobileCoords.x*20)}]} onPress={() => {
                        Alert.alert('Mobile Device', `X:${mobileCoords.x*20} \nY: ${mobileCoords.y *20}`, [
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
        <View style={{width: '100%', height: '100%'}}>
            {!loadDevices && deviceLoading && <View style={[styles.loaderContainer, {zIndex: 10}]}>
                <ActivityIndicator color={'teal'} size={25} />
            </View>}
            <View>
                <SearchBar containerStyle={{backgroundColor: 'white'}} style={styles.searchCont} 
                    inputContainerStyle={{backgroundColor: 'white'}}
                    placeholder="Search.."
                    onChangeText={(val) => {setSearch(val); renderTags(val)}}
                    value={search}
                />
                <View style={styles.mapContainer}>
                    {dataLoading ? <View pointerEvents="none" style={styles.dt_loading_cont}>
                        <ActivityIndicator color={'teal'} size={35} />
                    </View> : null}
                    <View style={[styles.mapHolder]} ref={view => {
                        if(!view) return;
                        view.measure((ps, pt, width, height, x, y) => {
                            setmapHolderPost({x, y, height, width})
                        })
                        
                    }}>
                        <ImageBackground source={require('../../assets/images/building.jpg')} style={{width: '100%', height: '100%', position: 'absolute', opacity: 0.2}}>
                        </ImageBackground>
                        {loadDevices}
                    </View>
                </View>
            </View>
        </View>
        
    )
}

export default Map;