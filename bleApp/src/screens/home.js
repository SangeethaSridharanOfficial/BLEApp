import React, {useState, useEffect, useContext} from 'react';
import { View, ActivityIndicator } from 'react-native';
import Header from './header';
import {useNavigation} from '@react-navigation/native';
import { GlobalContext } from '../context/Provider';
import Map from '../components/map';
import HomeContainer from '../container/homeContainer';
import axiosInstance from '../utils/axiosInstance';
import styles from '../components/map/styles';
import devicesAction from '../context/actions/devicesAction';
import { HOME } from '../constants/routeNames';
import {SearchBar} from 'react-native-elements';

const Home = () => {
    const {setOptions, toggleDrawer} = useNavigation();
    const { authState: {data} } = useContext(GlobalContext);
    const [isDeviceLoaded, setIsDeviceLoaded] = useState(false);
    const { deviceDispatch, deviceState: {activeState}} = useContext(GlobalContext);

    useEffect(() => {
        setOptions({
            headerStyle: {
                backgroundColor: '#ccccf8'
            },
            headerTitle: () => <Header toggleDrawer={toggleDrawer} data={data} activePage={HOME}/>
        });

        axiosInstance.get('/ble/allTags').then((resp) => {
            if(resp.data.data && resp.data.data.length){
                resp.data.data.forEach(data => {
                    data['notLoaded'] = true;
                    data['id'] = data._id;
                    data['isAdded'] = true;
                    devicesAction(data, 'STORED_DEVICES')(deviceDispatch);
                })
                setIsDeviceLoaded(true);
            }
            setIsDeviceLoaded(true);
        }).catch(err => {
            console.log('Error from api ', err);
            setIsDeviceLoaded(false);
        })
    }, [])

    return(<HomeContainer>
        {isDeviceLoaded && activeState === HOME? 
        <Map/> : 
        <View style={styles.loaderContainer}>
            <ActivityIndicator color={'teal'} size={25} />
        </View>}
    </HomeContainer>)
}

export default Home;