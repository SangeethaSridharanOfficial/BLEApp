import React, {useState, useEffect, useContext} from 'react';
import { BleManager } from 'react-native-ble-plx';
import { requestLocationPermission } from '../utils/permission';
import { Alert, View, ActivityIndicator, Button, ScrollView, TextInput, Text, TouchableOpacity } from 'react-native';
import { GlobalContext } from '../context/Provider';
import devicesAction from '../context/actions/devicesAction';
import styles from '../components/container/styles';
import DeviceContainer from '../components/container/deviceContainer';
import {useNavigation} from '@react-navigation/native';
import Header from './header';
import Device from '../components/devices/index';
import Modal from 'react-native-modal';
import axiosInstance from '../utils/axiosInstance';
import { validateXYCoords, scanningDevices } from '../utils/helper';
import { DEVICES } from '../constants/routeNames';

const Devices = () => {
    const [isLoading, setIsLoading] = useState(false);
    const manager = new BleManager();
    const { deviceDispatch, deviceState: {devices, isScanning}, authDispatch, authState: {isLoggedIn, data} } = useContext(GlobalContext);
    const {setOptions, toggleDrawer} = useNavigation();
    const [xCoordsVal, setXCoordsVal] = useState('');
    const [yCoordsVal, setYCoordsVal] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [currentDevice, setCurrentDevice] = useState(null);
    const [scannedDevices, setScannedDevices] = useState(null);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        setXCoordsVal('');
        setYCoordsVal('');
    };
   

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

    const addCoordinates = (deviceType) => {
        try{
            if(validateXYCoords(xCoordsVal, yCoordsVal)){
                let cordinatesVal = `${xCoordsVal} ${yCoordsVal}`;
                devicesAction({cordinatesVal, currentDevice, dType: deviceType}, 'SET_COORDS')(deviceDispatch);
                devicesAction({deviceType, currentDevice}, 'SET_DTYPE')(deviceDispatch);
                handleDevice('ADD', deviceType, cordinatesVal, currentDevice);
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

    const handleDevice = (async (type, dType, cordinatesVal, cDevice) => {
        try{
            devicesAction(cDevice, type)(deviceDispatch);
            let reqObj = {
                toAdd: type === 'ADD',
                dId: cDevice.id,
                dType
            };
            if(type === 'ADD'){
                reqObj['dName'] = cDevice.name;
                reqObj['coords'] = cordinatesVal;
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
            if(type === 'ADD') toggleModal();
            else {
                devices.forEach(d => {
                    if(d.id === device.id){
                        handleDevice('REMOVE', d.dType, null, device);
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
            axiosInstance.get('/ble/allTags').then((resp) => {
                if(devices.length){
                    devices.forEach(device => {
                        if(device.isScanned) isDeviceScanned = true;
                        if(device.isScanned){
                            console.log('device', device.rssi);
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
                            manager.connectToDevice(device.id, {autoConnect:true}).then(data => {
                                console.log(data);
                            }).catch(err => {
                                console.log(err);
                            })
                        }
                        let count = 0;
                        resp.data.data.forEach(data => {
                            if(data._id === device.id){
                                if(data.coords) devicesAction({cordinatesVal: data.coords, dType: data.dType, currentDevice: device}, 'SET_COORDS')(deviceDispatch);
                                resultedDevices.push(
                                    <Device key={device.id} device={device} handleToggle={handleToggle} isAdded={true} initCoords={data.coords}/>
                                )
                                count++;
                            }
                        })
                        if(!count){
                            resultedDevices.push(
                                <Device key={device.id} device={device} handleToggle={handleToggle}/>
                            )
                            count--;
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
            }).catch((err) => {
                console.error('Error ', err);
            })
        }catch(err){
            console.error('Error in renderDevices ', err.stack);
        }
    }

    async function scanDevices(){
        const permission = await requestLocationPermission();
        if(permission){
            devicesAction(true, 'SCANNING')(deviceDispatch);
            setIsLoading(true);
            scanningDevices(deviceDispatch, devicesAction, manager);
            setTimeout(() => {
                manager.stopDeviceScan();
                devicesAction(false, 'SCANNING')(deviceDispatch);
                setIsLoading(false);
            }, 5000);
        }
    };

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
            <Modal isVisible={isModalVisible}>
                <View style={styles.addTagView}>
                    <View style={styles.at_header}>
                        <Text style={styles.at_he_text}>Add New Tags</Text>
                    </View>
                    <View style={styles.at_co_wrapper}>
                        <View style={styles.at_co_cont}>
                            <View style={styles.at_co_txt}>
                                <Text style={styles.at_txt}>X: </Text>
                            </View>
                            <TextInput style={styles.at_ipt} onChangeText={(text) => {
                                setXCoordsVal(text);
                            }} 
                            value={xCoordsVal}></TextInput>
                        </View>
                        <View style={styles.at_co_cont}>
                            <View style={styles.at_co_txt}>
                                <Text style={styles.at_txt}>Y: </Text>
                            </View>
                            <TextInput style={styles.at_ipt} onChangeText={(text) => {
                                setYCoordsVal(text);
                            }} 
                            value={yCoordsVal}></TextInput>
                        </View>
                    </View>
                    <View style={styles.tagBtns_wrapper}>
                        <TouchableOpacity style={styles.at_btn} onPress={() => {
                            addCoordinates('beacon');
                            toggleModal();
                        }}>
                            <Text style={styles.at_btn_txt}>Beacon</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.at_btn} onPress={() => {
                            addCoordinates('asset');
                            toggleModal();
                        }}>
                            <Text style={styles.at_btn_txt}>Asset</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.at_cancel_btn_wrp}>
                        <TouchableOpacity style={styles.at_cancel_btn} onPress={() => {
                            toggleModal();
                        }}>
                            <Text style={styles.at_cancel_btn_txt}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <TextInput style={styles.coordsIpt}
                        onChangeText={(text) => {
                            setCordinatesVal(text);
                        }} 
                        value={cordinatesVal}
                    ></TextInput>
                    <Button title="Cancel" onPress={() => {
                        toggleModal();
                    }} /> */}
                </View>
            </Modal>
        </DeviceContainer> 
    )
};

export default Devices;