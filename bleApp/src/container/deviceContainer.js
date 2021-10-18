import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const DeviceContainer = ({isLoggedIn, style, children}) => {
    return (
        <View style={styles.deviceWrapper}>{children}</View>
    )
};

export default DeviceContainer;