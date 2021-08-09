import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const HomeContainer = ({isLoggedIn, style, children}) => {
    return (
        <View>{children}</View>
    )
};

export default HomeContainer;