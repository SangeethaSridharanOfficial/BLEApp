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
import { LOGIN } from '../constants/routeNames';


const ResetPassword = ({ navigation }) => {
    
    const [eVal, setEmail] = useState('')
    const [pVal, setPassword] = useState('')
    const [newPVal, setNewPassword] = useState('')

    const { authDispatch, authState: {error, loading, data} } = useContext(GlobalContext);

    const resetP = () => {
            axiosInstance.post('user/resetPassword',
                {
                    email:eVal,
                    password: pVal,
                    newPassword: newPVal
                },{ headers: { 'Content-Type': 'application/json' }}
                ).then(res => {
                    console.log("Server Data : "+res.data);
                    
                    if(res.data=="") {
                        alert('Please try again');
                    }
                    else if(res.data.token != null){
                        //console.log("token Data : "+res.data.token);
                        alert('Password Successfully Changed');
                        setEmail('');
                        setPassword('');
                        setNewPassword('');
                        navigation.navigate(LOGIN);
                    }
                    else{
                        alert('Something went wrong.');
                    }
                }, (error) => { console.log(error) }
            );
            //console.log('test reset password', email, ' ', pass, ' ', newPass);
        }

    return (
        <AuthContainer>
            <Image source={require('../assets/images/CPLogo.png')} style={styles.loginImg}></Image>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.loginContainer}>
                    <View>
                        <Text> Reset Password </Text>
                        <TextInput style={styles.input} 
                            keyboardType='email-address'
                            underlineColorAndroid = "transparent"
                            placeholder='Enter email'
                            placeholderTextColor = "#9a73ef"
                            autoCapitalize = "none"
                            blurOnSubmit={false}
                            //onSubmitEditing={(val) => setEmail(val)}
                            onChangeText={(val) => setEmail(val)}
                        />
                        <TextInput style={styles.input} 
                            underlineColorAndroid = "transparent"
                            placeholder='Enter Temporary Password'
                            placeholderTextColor = "#9a73ef"
                            autoCapitalize = "none"
                            secureTextEntry = {true}
                            blurOnSubmit={false}
                            //onSubmitEditing={(val) => setPassword(val)}
                            onChangeText={(val) => setPassword(val)}
                        />
                        <TextInput style={styles.input} 
                            underlineColorAndroid = "transparent"
                            placeholder='Enter New Password'
                            placeholderTextColor = "#9a73ef"
                            autoCapitalize = "none"
                            secureTextEntry = {true}
                            blurOnSubmit={false}
                            //onSubmitEditing={(val) => setPassword(val)}
                            onChangeText={(val) => setNewPassword(val)}
                        />
                        <FlatButton 
                            buttonTitle = "Submit"
                            action = { () => {
                                //console.log('email: ', email, 'pass: ', password)
                                resetP()
                            }}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback> 
        </AuthContainer>
    )
};

export default ResetPassword;