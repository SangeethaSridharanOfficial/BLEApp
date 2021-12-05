import React, {useContext, useEffect, useState, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Text, View, Alert, TouchableOpacity, ActivityIndicator, Image} from 'react-native';
import LocHeader from '../components/location/header';
import styles from '../components/location/styles';
import { GlobalContext } from '../context/Provider';
import axiosInstance from '../utils/axiosInstance';
import colors from '../assets/themes/colors';

export default Location = () => {
    const {navigate, setOptions} = useNavigation();
    const [isDeviceAvailable, setIsDeviceAvailable] = useState(true);
    const { deviceDispatch, deviceState: {devicePos, devices}} = useContext(GlobalContext);
    let locHolderPos = null;
    const [loadAssets, setLoadAssets] = useState([]);
    const assetCount = {};
    const colorArrs = ['#cca9ee', '#bb87ee', '#a157ea', '#9647e4'];
    const viewRef = useRef(null);

    useEffect(() => {
        setOptions({
            headerStyle: {
                backgroundColor: '#ccccf8'
            },
            headerTitle: () => <LocHeader navigate={navigate}/>
        });
        
        viewRef.current.measure((ps, pt, width, height, x, y) => {
            if(width && height){
                height = height/100;
                width = width/100;
                locHolderPos = {x, y, height, width};
                const id = devicePos.device ? devicePos.device.id : '';
                if(id){
                    processLocation(id);
                }else{
                    setIsDeviceAvailable(false);
                    if(isLoading) setIsLoading(false);
                }
            }
        }); 

    }, [])

    const fetchLocationData = (id) => {
        try{
            return new Promise((resolve, reject) => {
                axiosInstance.get(`/azure/location/asset?id=${id}`).then(resp => {
                    return resolve(resp.data);
                }).catch(err => {
                    return reject(err);
                }) 
            });
        }catch(err){
            console.error('Error in fetchLocationData ', err);
        }
    }

    const processLocation = (id) => {
        try{
            fetchLocationData(id).then(({data}) => {
                renderAssetDevice(data);
            }).catch(err => {
                console.error('Error in fetchLocationCall ', err);
            })
        }catch(err){
            console.error('Error in processLocation ', err);
        }
    }

    const renderAssetDevice = (data) => {
        try{
            let assetEles = [];
            data.forEach((val) => {
                if(assetCount[`${val.x} ${val.y}`])
                    assetCount[`${val.x} ${val.y}`] = assetCount[`${val.x} ${val.y}`] + 1;
                else
                    assetCount[`${val.x} ${val.y}`] = 1;
            })

            data.forEach((val) => {
                let chooseColor; 
                if(assetCount[`${val.x} ${val.y}`] < 4){
                    chooseColor = colorArrs[assetCount[`${val.x} ${val.y}`]];
                }else{
                    chooseColor = colors.asset;
                }
                assetEles.push(
                    <TouchableOpacity style={[styles.tagHolder, {top: Math.abs(val.y * locHolderPos.height), left: Math.abs(val.x * locHolderPos.width)}]} key={Math.random()} onPress={e => {
                        Alert.alert(`${val.Name} Details`, `X: ${val.x} \nY: ${val.y} \nRepeated: ${assetCount[`${val.x} ${val.y}`]} time(s)`, [
                            {
                              text: 'Ok',
                              onPress: () => {},
                            }
                        ]);
                    }}>
                        <Image source={require('../assets/images/assetRoundPointer.gif')} style={[styles.ap_img]} tintColor={chooseColor}></Image>
                    </TouchableOpacity>
                )
            });
            setLoadAssets(assetEles);
        }catch(err){
            console.error('Error in renderAssetDevice ', err);
        }
    }

    return (
        <View style={styles.locContainer}>
            <View style={styles.alocHolder} ref={viewRef}>{loadAssets}</View>
        </View>
    )
}