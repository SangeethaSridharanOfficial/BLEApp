import React, {useState, useEffect, useContext} from 'react';
import { BleManager } from 'react-native-ble-plx';
import { requestLocationPermission } from '../utils/permission';
import { Alert, View, ActivityIndicator, Button, ScrollView } from 'react-native';
import { GlobalContext } from '../context/Provider';
import devicesAction from '../context/actions/devicesAction';
import styles from '../container/styles';
import DeviceContainer from '../container/deviceContainer';
import {useNavigation} from '@react-navigation/native';
import Header from './header';
import Device from '../components/devices/index';
import axiosInstance from '../utils/axiosInstance';
import { validateXYCoords, scanningDevices } from '../utils/helper';
import { DEVICES } from '../constants/routeNames';
import AddTag from '../components/addTag';
import Modal from 'react-native-modal';
import DeviceMenu from '../components/deviceMenu/menu';

const Devices = () => {
    const [isLoading, setIsLoading] = useState(false);
    const manager = new BleManager();
    const { deviceDispatch, deviceState: {devices, isScanning, devicePos}, authDispatch, authState: {isLoggedIn, data} } = useContext(GlobalContext);
    const {setOptions, toggleDrawer} = useNavigation();
    const [currentDevice, setCurrentDevice] = useState(null);
    const [scannedDevices, setScannedDevices] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [disableSpecialDevOpt, setDisableSpecialDevOpt] = useState(false);

    useEffect(() => {
        const subscription = manager.onStateChange(state => {
            if (state === "PoweredOn") {
              subscription.remove();
            }
        }, true);

        setOptions({
            headerStyle: {
                backgroundColor: '#ccccf8'
            },
            headerTitle: () => <Header toggleDrawer={toggleDrawer} data={data} activePage={DEVICES}/>
        });
        if(devices.length){
            setIsLoading(true);
        }
        
    }, [])

    useEffect(() => {
        renderDevices();
    }, [devices.length]);

    useEffect(() => {
        if(scannedDevices && scannedDevices.length){
            if(isLoading) setIsLoading(false);
        }
    }, [scannedDevices])

    const addCoordinates = (deviceType, xCoordsVal, yCoordsVal, addForMobile) => {
        try{
            if(validateXYCoords(xCoordsVal, yCoordsVal)){
                let cordinatesVal = `${xCoordsVal} ${yCoordsVal}`;
                devicesAction({cordinatesVal, currentDevice, dType: deviceType, isSpecialDevice : addForMobile}, 'SET_COORDS')(deviceDispatch);
                devicesAction({deviceType, currentDevice}, 'SET_DTYPE')(deviceDispatch);
                handleDevice('ADD', deviceType, cordinatesVal, currentDevice, addForMobile);
            }else{
                Alert.alert('Error!!!', 'Please enter both X and Y coordinates properly to proceed', [
                    {
                      text: 'Ok',
                      onPress: () => {},
                    }
                ]);
            }
        }catch(err){
            console.error('Error in addCoordinates ', err.stack);
        }
    }

    const handleDevice = (async (type, dType, cordinatesVal, cDevice, addForMobile) => {
        try{
            devicesAction(cDevice, type)(deviceDispatch);
            let reqObj = {
                toAdd: type === 'ADD',
                dId: cDevice.id,
                dType,
                isSpecialDevice: addForMobile
            };
            if(type === 'ADD'){
                reqObj['dName'] = cDevice.name;
                reqObj['coords'] = cordinatesVal;
                devicesAction({id: cDevice.id, isSpecialDevice: addForMobile}, 'SPECIAL_DEVICE')(deviceDispatch);
            }else{
                devicesAction({id: cDevice.id, isSpecialDevice: addForMobile}, 'SPECIAL_DEVICE')(deviceDispatch);
            }
            axiosInstance.post('/ble/BLETag', reqObj).then(() => {
                console.log('Info Saved Successfully!!');
            }).catch((err) => {
                console.error('Error ', err);
            })
        }catch(err){
            console.error('Error in handleDevice ', err);
        }
    });

    const handleToggle = (device, type) => {
        try{
            setCurrentDevice(device);
            if(type === 'ADD') {
                let count = 0;
                devices.forEach(d => {
                    if(d.isSpecialDevice){
                        count += 1;
                    }
                })
                if(count === 3){
                    setDisableSpecialDevOpt(true);
                }else{
                    setDisableSpecialDevOpt(false);
                }
                toggleModal();
            }
            else {
                devices.forEach(d => {
                    if(d.id === device.id){
                        handleDevice('REMOVE', device.dType, null, device, false);
                    }
                })
                
            }
        }catch(err){
            console.error('Error in handleToggle ', err.stack);
        }
    }

    const renderDevices = () => {
        try{
            let resultedDevices = [];
            let isDeviceScanned = false;
            // axiosInstance.get('/ble/allTags').then((resp) => {
                if(devices.length){
                    devices.forEach(device => {
                        if(device.isScanned) isDeviceScanned = true;
                        // if(device.isScanned){
                            // // device.connect()
                            // // .then((device) => {
                            // //     console.log('discovered: ', device.discoverAllServicesAndCharacteristics());
                            // // })
                            // // .then((device) => {
                            // // // Do work on device with services and characteristics
                            // // })
                            // .catch((error) => {
                            //     console.log('Error while connecting ', error);
                            // });
                            // manager.connectToDevice(device.id, {autoConnect:true}).then(data => {
                            //     console.log(data);
                            // }).catch(err => {
                            //     console.log(err);
                            // })
                        // }
                        // let count = 0;
                        // resp.data.data.forEach(data => {
                        //     if(data._id === device.id){
                        if(device.coords){ 
                            devicesAction({cordinatesVal: device.coords, dType: device.dType, currentDevice: device}, 'SET_COORDS')(deviceDispatch);
                            resultedDevices.push(
                                <Device key={device.id} device={device} handleToggle={handleToggle} isAdded={true} initCoords={device.coords}/>
                            )
                        }
                        //         count++;
                        //     }
                        // })
                        // if(!count){
                        else{
                            resultedDevices.push(
                                <Device key={device.id} device={device} handleToggle={handleToggle}/>
                            )
                            // count--;
                        }
                    });
                }else{
                    isDeviceScanned = true;
                }
                setScannedDevices(resultedDevices);
                if(!isDeviceScanned){
                    Alert.alert('Previously added devices are listed', 'Please scan to get a new devices nearby', [
                        {
                          text: 'Ok',
                          onPress: () => {},
                        }
                    ]);
                }
            // }).catch((err) => {
            //     console.error('Error ', err);
            // })
        }catch(err){
            console.error('Error in renderDevices ', err.stack);
        }
    }

    async function scanDevices(){
        const permission = await requestLocationPermission();
        if(permission){
            devicesAction(true, 'SCANNING')(deviceDispatch);
            setIsLoading(true);
            scanningDevices(deviceDispatch, devicesAction, manager, null, 5000);
            let timeoutDev = setTimeout(() => {
                devicesAction(false, 'SCANNING')(deviceDispatch);
                setIsLoading(false);
                clearTimeout(timeoutDev);
            }, 5000);
        }
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    }

    return (
        <DeviceContainer isLoggedIn={isLoggedIn}>
            {/* <View style={styles.headerCont}>
                <TouchableOpacity style={styles.logout} underlayColor='white' onPress={_ => {
                    if(devices.length){
                        devices.forEach(device => {
                            disconnectDevice(device);
                        })
                    }
                    loginAction('LOGOUT')(authDispatch);
                }}>
                    <Text>Logout</Text>
                </TouchableOpacity>

                <View>
                    <Text style={styles.userName}>{data.userName}</Text>
                </View>
            </View> */}

            <View style={styles.actionBtn}>
               <Button
                    title="Scan devices"
                    onPress={() => {
                        // devicesAction('', 'CLEAR')(deviceDispatch);
                        if(!isScanning && !isLoading){
                            scanDevices();
                        }
                    }}
                />
                {isLoading && 
                    <View>
                        <ActivityIndicator color={'teal'} size={25} />
                    </View>
                }
            </View>
            
            <ScrollView style={styles.deviceList}>
                {devices.length != 0 && <View>{scannedDevices}</View>}
            </ScrollView>
            {devicePos.open && <DeviceMenu />}
            <Modal isVisible={isModalVisible}>
                <AddTag addCoordinates={addCoordinates} toggleModal={toggleModal} disableSpecialDevOpt={disableSpecialDevOpt}/>
            </Modal>
            
        </DeviceContainer> 
    )
};

export default Devices;