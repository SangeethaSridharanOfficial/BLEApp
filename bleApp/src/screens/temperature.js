import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Text, View, ScrollView} from 'react-native';
import TempHeader from '../components/temperature/header';
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import colors from '../assets/themes/colors';
import styles from '../components/temperature/styles';

const Temperature = () => {
    const {navigate, setOptions} = useNavigation();
    const screenWidth = Dimensions.get("window").width - 20;
    const screenHeight = Dimensions.get('window').height -500;

    useEffect(() => {
        setOptions({
            headerStyle: {
                backgroundColor: '#ccccf8'
            },
            headerTitle: () => <TempHeader navigate={navigate} />
        });
    }, [])
    const chartConfig = {
        // backgroundGradientFrom: "#1E2923",
        // backgroundGradientFromOpacity: 0,
        // backgroundGradientTo: "#08130D",
        // backgroundGradientToOpacity: 0.5,
        // color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        // strokeWidth: 3, // optional, default 3
        // barPercentage: 0.5,
        // useShadowColorFromDataset: false // optional
        backgroundColor: "#e26a00",
        backgroundGradientFrom: colors.accent,
        backgroundGradientTo: colors.success, //"#ffa726"
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
        }
    };   
    
    const data = {
        labels: ['1:30:15 PM', '1:30:35 PM', '2:00:30 PM', '3:30:20 PM'], // hours
        datasets: [
          {
            data: [-1, 22, 20, 15], // temp
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            strokeWidth: 2 // optional
          }
        ],
        legend: ["Temperature"] // optional
    };

    return(
        <View style={styles.tempContainer}>
            <ScrollView horizontal={true} vertical={false} style={styles.chartHolder}>
                <LineChart
                    data={data}
                    width={500}
                    height={screenHeight}
                    verticalLabelRotation={30}
                    chartConfig={chartConfig}
                    bezier
                    onDataPointClick={(data) => {
                        console.log('Data ', data);
                        // return (
                        //     <View
                        //       style={{
                        //         position: 'absolute',
                        //         backgroundColor: 'red',
                        //         top: data.y,
                        //         left: data.x,
                        //         height: 100,
                        //         width: 100,
                        //         zIndex: 1000,
                        //       }}></View>
                        // );
                    }}
                />
            </ScrollView>
        </View>
    )
}

export default Temperature;