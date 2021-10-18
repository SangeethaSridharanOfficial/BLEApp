import React, {useState, useContext} from 'react';
import { Text, View, Image, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AuthContainer from '../container/authContainer';
import styles from '../container/styles';
import { GlobalContext } from '../context/Provider';
import FlatButton from '../components/MyButton';
import axiosInstance from '../utils/axiosInstance';
import { LOGIN } from '../constants/routeNames';


const Signup = ({ navigation }) => {
    const [eVal, setEmail] = useState('')
    const [uVal, setUsername] = useState('')
    const [pVal, setPassword] = useState('')
    const [errorText, setErrorText] = useState('');
    
    const { authDispatch, authState: {error, loading, data} } = useContext(GlobalContext);

    const register = () => {
        axiosInstance.post('user/signup',
            {
                username: uVal,
                email: eVal,
                password: pVal
            },{ headers: { 'Content-Type': 'application/json' }}
            ).then(res => {
                console.log("Server Data : "+res.data);
                
                if(res.data.token!=""){
                    //console.log("token Data : "+res.data.token);
                    alert('Register successfully, now you can login');
                    navigation.navigate(LOGIN);
                }
                else{
                    alert('Something went wrong.');
                }
            }, (error) => { console.log(error) }
        );
        //console.log('test signup', username, ' ', email, ' ', pass);
    }

    return (
        <AuthContainer>
            <Image source={require('../assets/images/CPLogo.png')} style={styles.loginImg}></Image>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.loginContainer}>
                    <View>
                        <Text> Register </Text>
                        <TextInput style={styles.input} 
                            underlineColorAndroid = "transparent"
                            placeholder='Enter username'
                            placeholderTextColor = "#9a73ef"
                            autoCapitalize = "none"
                            blurOnSubmit={false}
                            onChangeText={(val) => setUsername(val)}
                        />
                        <TextInput style={styles.input} 
                            keyboardType='email-address'
                            underlineColorAndroid = "transparent"
                            placeholder='Enter email'
                            placeholderTextColor = "#9a73ef"
                            autoCapitalize = "none"
                            blurOnSubmit={false}
                            onChangeText={(val) => setEmail(val)}
                        />
                        <TextInput style={styles.input} 
                            underlineColorAndroid = "transparent"
                            placeholder='Enter Password'
                            placeholderTextColor = "#9a73ef"
                            autoCapitalize = "none"
                            secureTextEntry = {true}
                            blurOnSubmit={false}
                            onChangeText={(val) => setPassword(val)}
                        />
                        <FlatButton 
                            buttonTitle = "Submit"
                            action = { () => {
                                //console.log('email: ', email, 'pass: ', password)
                                register()
                            }}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback> 
        </AuthContainer>
    )
};

export default Signup;