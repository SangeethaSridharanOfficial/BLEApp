import React, {useState, useEffect, useContext} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../components/container/styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { GlobalContext } from '../context/Provider';

const Header = ({ toggleDrawer, data, activePage }) => {
    const { deviceDispatch, deviceState: {devices, isScanning} } = useContext(GlobalContext);

    return(
        <View style={styles.headerCont}>
            <TouchableOpacity style={styles.menuIcon}
                onPress={() => {
                    toggleDrawer();
                }}>
                <MaterialIcon size={25} name="menu" />
                <View style={styles.pageNameCont}>
                    <Text style={styles.pageName}>{activePage}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.rightWrapper}>
                <View>
                    <Text style={styles.userName}>{data.userName}</Text>
                </View>
            </View>
        </View>
    )
}

export default Header;