import React, { useEffect, useState, Component } from 'react';
import {View, TextInput, Text, TouchableOpacity, TouchableWithoutFeedback  } from 'react-native';
import styles from './styles';
import {CheckBox} from 'react-native-elements';

const AddTag = ({toggleModal, addCoordinates, disableSpecialDevOpt}) => {
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
                    if(parseInt(xCoordsVal) <= 300 && parseInt(yCoordsVal) <= 600){
                        addCoordinates('beacon', xCoordsVal, yCoordsVal, isSelected);
                        resetValues();
                    }else{
                        alert('Please insert proper X and Y values again');
                    }
                    
                }}>
                    <Text style={styles.at_btn_txt}>Beacon</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.at_btn} onPress={() => {
                    if(parseInt(xCoordsVal) <= 300 && parseInt(yCoordsVal) <= 600){
                        addCoordinates('asset', xCoordsVal, yCoordsVal, isSelected);
                        resetValues();
                    }else{
                        alert('Please insert proper X and Y values again');
                    }
                }}>
                    <Text style={styles.at_btn_txt}>Asset</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.checkboxContainer}>{
                disableSpecialDevOpt ? 
                <CheckBox 
                    Component={TouchableWithoutFeedback}
                    checked={isSelected}
                    title = 'Can add upto 3 special devices only'
                />:
                <CheckBox 
                    checked={isSelected}
                    title = 'Do you need to add this device for mobile calculation?'
                    onPress={() => {setSelection(!isSelected)}}
                />
            }           
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