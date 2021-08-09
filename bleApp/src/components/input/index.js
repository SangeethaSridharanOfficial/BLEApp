import React, { useEffect, useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import colors from '../../assets/themes/colors';
import styles from './styles';

const Input = ({onChangeText, securedTextEntry, icon, iconPosition, style, value, label, error, ...props}) => {
    const [isFocused, setIsFocused] = useState(false);

    const getFlexPosition = () => {
        try{
            if(icon && iconPosition){
                if(iconPosition === 'right'){
                    return 'row-reverse'
                }else{
                    return 'row'
                }
            }
        }catch(err){
            console.error('Error in getFlexPosition ', err.stack);
        }
    }

    const getAlignItem = () => {
        try{
            if(icon){
                return 'center'
            }else{
                return 'stretch'
            }
        }catch(err){
            console.error('Error in getAlignItem ', err.stack);
        }
    }

    const getBorderColor = () => {
        try{
            if(isFocused){
                return colors.primary;
            }
            if(error && iconPosition){
                if(iconPosition === 'right'){
                    return colors.danger;
                }else{
                    return colors.grey;
                }
            }
            if(!isFocused){
                return colors.grey;
            }
        }catch(err){
            console.error('Error in getBorderColor ', err.stack);
        }
    }

    return (
        <View style={styles.inputContainer}>
            {label && <Text>{label}</Text>}
            <View style={[styles.wrapper, {
                    flexDirection: getFlexPosition(), 
                    borderColor: getBorderColor(),
                    alignItems: getAlignItem()
                }]}>
                <View>{icon && icon}</View>
                <TextInput 
                    // keyboardType={"default"}
                    multiline={false}
                    style={[styles.textInput, style]} 
                    onChangeText={onChangeText} 
                    value={value}
                    securedTextEntry={true}
                    onFocus = {_ => {
                        setIsFocused(true);
                    }}
                    onBlur = {_ => {
                        setIsFocused(false);
                    }}
                    {...props}
                >
                </TextInput>
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    )
}

export default Input;