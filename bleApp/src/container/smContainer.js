import React from 'react';
import { ScrollView, View } from 'react-native';
import styles from './styles';

const SMContainer = ({style, children}) => {
    return(
        <ScrollView>
            <View style={[styles.sideWrapper, style]}>{children}</View>
        </ScrollView>
    )
}

export default SMContainer;