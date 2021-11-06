import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Text, View, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import TempHeader from '../components/temperature/header';
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import colors from '../assets/themes/colors';
import styles from '../components/temperature/styles';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import axiosInstance from '../utils/axiosInstance';
import { GlobalContext } from '../context/Provider';

const Temperature = () => {
    const {navigate, setOptions} = useNavigation();
    // const screenWidth = Dimensions.get("window").width - 20;
    const screenHeight = Dimensions.get('window').height;
    const [openToolTip, setOpenToolTip] = useState(false);
    const [tempData, setTempData] = useState(null);
    const [scrollPos, setScrollPos] = useState({x: 0});
    const [isLoading, setIsLoading] = useState(true);
    const [isDeviceAvailable, setIsDeviceAvailable] = useState(true);
    const { deviceDispatch, deviceState: {devicePos}} = useContext(GlobalContext);
    const [chartData, setChartData] = useState({});
    let dId = '';

    useEffect(() => {
        setOptions({
            headerStyle: {
                backgroundColor: '#ccccf8'
            },
            headerTitle: () => <TempHeader navigate={navigate} refreshData={loadData}/>
        });
        const id = devicePos.device ? devicePos.device.id : '';
        if(id){
            dId = id;
            loadData();
        }else{
            setIsDeviceAvailable(false);
            if(isLoading) setIsLoading(false);
        }
    }, [])

    const loadData = () => {
        try{
            if(!isDeviceAvailable) setIsDeviceAvailable(true);
            if(!isLoading) setIsLoading(true);
            fetchTemperatureData(dId).then((resp) => {
                if(resp.data.length){
                    let labels = [], data = [];
                    let tempDt = resp.data.slice(-10);
                    tempDt.forEach(dev => {
                        let time = dev.timestamp.split('T')[1].split('.')[0];
                        labels.push(time);
                        data.push(parseInt(dev.Temp));
                        labels = labels.reverse();
                        data = data.reverse();
                    })
                    setChartData({
                        labels, // hours
                        datasets: [
                        {
                            data, // temp
                            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                            strokeWidth: 2 // optional
                        }
                        ],
                        // legend: ["Temperature"] // optional
                    })
                    setIsLoading(false);
                    setIsDeviceAvailable(true);
                }else{
                    setIsDeviceAvailable(false);
                }
            }).catch((err) => {
                console.log('Error ', err);
                setIsLoading(false);
            })
        }catch(err){
            console.error('Error in loadData ', err);
        }
    }

    const fetchTemperatureData = (id) => {
        try{
            return new Promise((resolve, reject) => {
                axiosInstance.get(`/azure/Temperature/trends?id=${id}`).then(resp => {
                    return resolve(resp.data);
                }).catch(err => {
                    return reject(err);
                }) 
            });
        }catch(err){
            console.error('Error in fetchTemperatureData ', err);
        }
    }

    const chartConfig = {
        // backgroundGradientFrom: "#1E2923",
        // backgroundGradientFromOpacity: 0,
        // backgroundGradientTo: "#08130D",
        // backgroundGradientToOpacity: 0.5,
        // color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        // strokeWidth: 3, // optional, default 3
        barPercentage: 0.5,
        // useShadowColorFromDataset: false // optional
        backgroundColor: "#e26a00",
        backgroundGradientFrom: colors.accent,
        backgroundGradientTo: colors.success, //"#ffa726"
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => 'black', //`rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
        }
    };

    return(
        <View style={styles.tempContainer}>
            {(!isLoading && isDeviceAvailable) ? <View>
                <ScrollView horizontal={true} style={styles.chartHolder} onScroll={(event) => {
                    setScrollPos({x: event.nativeEvent.contentOffset.x});
                    setOpenToolTip(false);
                }}>
                    <TouchableOpacity activeOpacity={1} onPress={(e) => {
                        setOpenToolTip(false);
                    }}>
                        <LineChart
                            data={chartData}
                            width={600}
                            height={screenHeight}
                            verticalLabelRotation={30}
                            horizontalLabelRotation={30}
                            yLabelsOffset={10}
                            chartConfig={chartConfig}
                            bezier
                            onDataPointClick={(dt) => {
                                setTempData(dt);
                                setOpenToolTip(true);
                            }}
                            formatYLabel={val => `${parseInt(val)}`}
                            style={{
                                paddingRight: 30,
                                paddingLeft: 20
                            }}
                        />
                    </TouchableOpacity>
                </ScrollView>
                {openToolTip && <View
                    style={[styles.tooltipCont, {
                        top: tempData.y + 10,
                        left: tempData.x - scrollPos.x - 30
                    }]}>
                        <Text style={styles.tmpTxt}><Text style={{fontWeight: "bold"}}>{`Temperature: `}</Text><Text>{`${tempData.value}`}</Text></Text>
                        <Text style={styles.timeTxt}><Text style={{fontWeight: "bold"}}>{`Time: `}</Text><Text>{`${chartData.labels[tempData.index]}`}</Text></Text>
                </View>}
            </View> : 
            <View>
                {(!isDeviceAvailable) ? <Text style={{fontWeight: "bold"}} >{`No temperature data`}</Text> : <Text style={{fontWeight: "bold"}}>{`Loading...  `}<ActivityIndicator  color={colors.secondary}/></Text>}
            </View>}
        </View>
    )
}

export default Temperature;