import React, {useState, useContext} from 'react';
import { Text, View, Image, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AuthContainer from '../components/container/authContainer';
import Input from '../components/input';
import CustomButton from '../components/customButton';
import styles from '../components/container/styles';
import { GlobalContext } from '../context/Provider';
import loginAction from '../context/actions/loginAction';
import FlatButton from '../components/MyButton';
import axiosInstance from '../utils/axiosInstance';
import { RESETPASS } from '../constants/routeNames';


const ForgetPassword = ({ navigation }) => {
    const [eVal, setEmail] = useState('')
    const [errorText, setErrorText] = useState('');
    const { authDispatch, authState: {error, loading, data} } = useContext(GlobalContext);

    const forgetPass = () => {
        axiosInstance.post('user/forgetPassword',
            {
                email: eVal,
            },{ headers: { 'Content-Type': 'application/json' }}
            ).then(res => {
                console.log("Server Data : "+res.data);
                if(res.data.message == "") {
                    alert('Please try again');
                }
                else if(res.data.message != null) {
                    alert(res.data.message);
                    setEmail('');
                    navigation.navigate(RESETPASS);
                }
                else{
                    console.log('not known')
                }
            }, (error) => { console.log(error) }
        );
        //console.log('test forget password', email);
    }

    return (
        <AuthContainer>
            <Image source={require('../assets/images/CPLogo.png')} style={styles.loginImg}></Image>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.loginContainer}>
                    <View>
                        <Text> ForgetPassword </Text>
                        <TextInput style={styles.input} 
                            keyboardType='email-address'
                            underlineColorAndroid = "transparent"
                            placeholder='Enter email'
                            placeholderTextColor = "#9a73ef"
                            autoCapitalize = "none"
                            blurOnSubmit={false}
                            onChangeText={(val) => setEmail(val)}
                        />
                        <FlatButton 
                            buttonTitle = "Submit" 
                            action = { () => {
                                forgetPass()
                            }}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback> 
        </AuthContainer>
    )
};

export default ForgetPassword;