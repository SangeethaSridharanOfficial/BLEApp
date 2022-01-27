import React, { useEffect, useState, useContext } from 'react';
import {View, TextInput, Text, TouchableOpacity, TouchableWithoutFeedback  } from 'react-native';
import styles from './styles';
import {CheckBox} from 'react-native-elements';
import { GlobalContext } from '../../context/Provider';
import axiosInstance from '../../utils/axiosInstance';
import RadioButtonRN from 'radio-buttons-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../../assets/themes/colors';

const AddTag = ({toggleModal, addCoordinates, disableSpecialDevOpt, device}) => {
    const [xCoordsVal, setXCoordsVal] = useState('');
    const [yCoordsVal, setYCoordsVal] = useState('');
    const [isSelected, setSelection] = useState(false);
    const { deviceState: {mapHolderPos} } = useContext(GlobalContext);
    const [maxPos, setMaxPos] = useState(null);
    const widthCheck = 0, heightCheck = 0;
    const [isEditable, setIsEditable] = useState(true);
    const [opVal, setOpVal] = useState(1);
    const [loading, setLoading] = useState(false);

    const resetValues = () => {
        toggleModal();
        setXCoordsVal('');
        setYCoordsVal('');
        setLoading(false);
    };

    useEffect(() => {
        let maxHeight = Math.floor(mapHolderPos.height) - heightCheck,
        maxWidth = Math.floor(mapHolderPos.width) - widthCheck;
        setMaxPos({maxWidth, maxHeight})
    }, [])


    const fetchLocationData = (assetIds) => {
        try{
            return new Promise((resolve, reject) => {
                axiosInstance.post(`/azure/location/assetsloc`, {assetIds}).then(resp => {
                    return resolve(resp.data);
                }).catch(err => {
                    return reject(err);
                }) 
            });
        }catch(err){
            console.error('Error in fetchLocationData ', err);
        }
    }

    return(
        <View style={styles.addTagView}>
            <View style={styles.at_header}>
                <Text style={styles.at_he_text}>Add New Tags</Text>
            </View>
            <View style={styles.at_co_wrapper}>
                <View style={[styles.at_co_cont, {opacity: opVal}]}>
                    <View style={styles.at_co_txt}>
                        <Text style={styles.at_txt}>X: </Text>
                    </View>
                    <TextInput style={styles.at_ipt} onChangeText={(text) => {
                        setXCoordsVal(text);
                    }} 
                    editable={isEditable}
                    selectTextOnFocus={isEditable}
                    value={xCoordsVal}></TextInput>
                </View>
                <View style={[styles.at_co_cont, {opacity: opVal}]}>
                    <View style={styles.at_co_txt}>
                        <Text style={styles.at_txt}>Y: </Text>
                    </View>
                    <TextInput style={styles.at_ipt} onChangeText={(text) => {
                        setYCoordsVal(text);
                    }} 
                    editable={isEditable}
                    selectTextOnFocus={isEditable}
                    value={yCoordsVal}></TextInput>
                </View>
            </View>
            <View style={{display: 'flex'}}>
            <RadioButtonRN
                data={[{label: "Beacon"}, {label: "Asset"}]}
                selectedBtn={(e) => {
                    if(e.label === 'Asset'){
                        setIsEditable(false);
                        setOpVal(0.5);
                    }else if(e.label === 'Beacon'){
                        setIsEditable(true);
                        setOpVal(1);
                    }
                }}
                icon={
                    <Icon
                        name="check-circle"
                        size={20}
                        color="#2c9dd1"
                    />
                }
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}
                boxStyle={{
                    width: 160,
                    height: 50,
                    backgroundColor: colors.grey,
                    borderRadius: 0
                }}
                textStyle={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginLeft: 10
                }}
                initial={1}
                circleSize={13}
                />
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
            <View style={styles.tagBtns_wrapper}>
                <TouchableOpacity style={styles.at_btn} onPress={() => {
                    if(loading) return;
                    setLoading(true);
                    if(isEditable){
                        let x = xCoordsVal*20;
                        let y = yCoordsVal*20;
                        //&& parseInt(x) <= maxPos.maxWidth && parseInt(y) <= maxPos.maxHeight
                        //&& parseInt(x) >= widthCheck && parseInt(y) >= heightCheck
                        if(xCoordsVal != '' && yCoordsVal != '' ){
                            addCoordinates('beacon', xCoordsVal, yCoordsVal, isSelected);
                            resetValues();
                        }else{
                            alert('Please insert proper X and Y values again');
                        }
                    }else{
                        fetchLocationData([device.id]).then(resp => {
                            if(resp.data.length){
                                let x = `${resp.data[0].x}`, y = `${resp.data[0].y}`;
                                addCoordinates('asset', x, y, isSelected);
                            }else{
                                alert("Device Not Found!!!");
                            }
                            resetValues();
                        }).catch(err => {
                            console.error('error in fetchLocation ', err);
                            addCoordinates('asset', xCoordsVal, yCoordsVal, isSelected);
                            resetValues();
                        })
                    }
                    
                }}>
                    <Text style={styles.at_btn_txt}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.at_btn} onPress={() => {
                    resetValues();
                }}>
                    <Text style={styles.at_btn_txt}>Cancel</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.at_btn} onPress={() => {
                    if(parseInt(xCoordsVal) <= maxPos.maxWidth && parseInt(yCoordsVal) <= maxPos.maxHeight
                    && parseInt(xCoordsVal) > widthCheck && parseInt(yCoordsVal) > heightCheck){
                        fetchLocationData([device.id]).then(resp => {
                            let x = `${resp.data[0].x}`, y = `${resp.data[0].y}`;
                            addCoordinates('asset', x, y, isSelected);
                            resetValues();
                        }).catch(err => {
                            console.error('error in fetchLocation ', err);
                            addCoordinates('asset', xCoordsVal, yCoordsVal, isSelected);
                            resetValues();
                        })

                       
                    }else{
                        alert('Please insert proper X and Y values again');
                    }
                }}>
                    <Text style={styles.at_btn_txt}>Asset</Text>
                </TouchableOpacity> */}
            </View>
            
            {/* <View style={styles.at_cancel_btn_wrp}>
                <TouchableOpacity style={styles.at_cancel_btn} onPress={() => {
                    resetValues();
                }}>
                    <Text style={styles.at_cancel_btn_txt}>Cancel</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    )
}

export default AddTag;