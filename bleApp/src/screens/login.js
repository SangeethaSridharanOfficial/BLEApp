import React, {useState, useContext} from 'react';
import { Text, TextInput, View, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AuthContainer from '../components/container/authContainer';
import Input from '../components/input';
import CustomButton from '../components/customButton';
import styles from '../components/container/styles';
import { GlobalContext } from '../context/Provider';
import loginAction from '../context/actions/loginAction';
import { useNavigation } from '@react-navigation/native';
import FlatButton from '../components/MyButton';
import axiosInstance from '../utils/axiosInstance';
import { SIGNUP, FORGETPASS, RESETPASS } from '../constants/routeNames';


const Login = () => {
    const [eVal, onNameChange] = useState('');
    const [pVal, onPassChange] = useState('');
    const [errorText, setErrorText] = useState('');
    const navigation = useNavigation();
    const { authDispatch, authState: {error, loading, data} } = useContext(GlobalContext);

    const loginToApp = () => {
        axiosInstance.post('user/login',
            {
                email:eVal,
                password: pVal
            }, { headers: { 'Content-Type': 'application/json' }}
            ).then(res => {
                console.log("Server Data : "+res.data);
                console.log("token Data : "+res.data.token);
                if(res.data.token=="") {
                    alert('Wrong Credentials, please try again');
                }
                else if(res.data.message!=null) {
                    alert(res.data.message);
                }
                else {
                    //console.log('fantastic ' + email)
                    setErrorText('')
                    loginAction('LOGIN_SUCCESS', {email: eVal})(authDispatch);            
                }
            }
        )
    }

    return (
        <AuthContainer>
            <Image source={require('../assets/images/CPLogo.png')} style={styles.loginImg}></Image>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <Text style={styles.title}>Welcome to Indoor Navigation App</Text>
                    <TextInput style={styles.input} 
                        keyboardType='email-address'
                        underlineColorAndroid = "transparent"
                        placeholder='Enter email'
                        placeholderTextColor = "#9a73ef"
                        autoCapitalize = "none"
                        blurOnSubmit={false}
                        onChangeText={text => {
                            onNameChange(text);
                            setErrorText('')
                        }}
                    />    
                    <TextInput style={styles.input} 
                        underlineColorAndroid = "transparent"
                        placeholder='Enter Password'
                        placeholderTextColor = "#9a73ef"
                        autoCapitalize = "none"
                        secureTextEntry = {true}
                        blurOnSubmit={false}
                        onChangeText={text => {
                            onPassChange(text)
                            setErrorText('')
                        }}
                    />    
                    <FlatButton 
                        buttonTitle = "Submit" 
                        action = { () => {
                            //console.log('email: ', email, 'pass: ', password)
                            loginToApp()
                        }}
                    />    
                    <Text style={{color:'black',top:'2%'}} 
                        onPress={() => {
                        navigation.navigate(FORGETPASS)
                        }}
                    > Forgot Password?
                    </Text>
                    <Text style={{color:'black',top:'3%'}} 
                        onPress={() => {
                        navigation.navigate(RESETPASS)
                        }}
                    > Change Password
                    </Text>
                    <Text style={{color:'red',top:'4%'}} 
                        onPress={()=>{
                        navigation.navigate(SIGNUP)
                        }}
                    > New User? Click Here to Regsiter
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        </AuthContainer>
    )
};

export default Login;