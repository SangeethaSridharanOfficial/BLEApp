import React, { useEffect, useState } from 'react';
import {View, TextInput, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import CheckBox from '@react-native-community/checkbox';

const AddTag = ({toggleModal, addCoordinates}) => {
    const [xCoordsVal, setXCoordsVal] = useState('');
    const [yCoordsVal, setYCoordsVal] = useState('');
    const [isSelected, setSelection] = useState(false);

    const resetValues = () => {
        toggleModal();
        setXCoordsVal('');
        setYCoordsVal('');
    };

    return(
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
                    addCoordinates('beacon', xCoordsVal, yCoordsVal);
                    resetValues();
                }}>
                    <Text style={styles.at_btn_txt}>Beacon</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.at_btn} onPress={() => {
                    addCoordinates('asset', xCoordsVal, yCoordsVal);
                    resetValues();
                }}>
                    <Text style={styles.at_btn_txt}>Asset</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.checkboxContainer}>
                <CheckBox
                    value={isSelected}
                    onValueChange={setSelection}
                    style={styles.tag_chkbx}
                />
                <Text>Do you need to add this device for mobile calculation?</Text>
            </View>
            <View style={styles.at_cancel_btn_wrp}>
                <TouchableOpacity style={styles.at_cancel_btn} onPress={() => {
                    resetValues();
                }}>
                    <Text style={styles.at_cancel_btn_txt}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AddTag;