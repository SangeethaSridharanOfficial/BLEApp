import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../container/styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const Header = ({ toggleDrawer, data, activePage }) => {

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
                    <Text style={styles.userName}>{data && data.userName}</Text>
                </View>
            </View>
        </View>
    )
}

export default Header;