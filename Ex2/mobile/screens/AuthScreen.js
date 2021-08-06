import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import { globalStyles } from '../styles/global.js';


const API_URL = Platform.OS === 'android' ? 'http://localhost:5000' : 'http://10.0.2.2:5000';


const AuthScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isLogin, setIsLogin] = useState(true);


    const onChange = () => {
        setIsLogin(!isLogin);
        setMessage('');
    }; //Fin de onChange

    const onLoggedIn = token => {
        fetch(`${API_URL}/private`,{
            method : 'GET',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(async res => {
                try{
                    const jsonRes = await res.json();
                    if(res.status === 200){
                        setMessage(jsonRes.message);
                    }
                }catch(err) {
                    console.log(err);
                }
            });
    }//Fin de onLoggedIn

    const onSubmit = () => {
        const payload = {
            email,
            password,
        };
        fetch(`${API_URL}/${isLogin?'login':'signup'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(async res => {
                try {
                    const jsonRes = await res.json();
                    if (res.status !== 200) {
                        setIsError(true);
                        setMessage(jsonRes.message);
                    } else {
                        onLoggedIn(jsonRes.token);
                        setIsError(false);
                        setMessage(jsonRes.message);
                    }
                } catch (err) {
                    console.log(err);
                }
            })
            .catch(err => {
                console.log(err);
            });
    };//Fin de onSubmit


    const getMessage = () => {
        const status = isError ? `Error: ` : `Success: `;
        return status + message;
    }

    return (
        <View style={globalStyles.card}>
            <Text style={globalStyles.heading}>{isLogin ? 'Login' : 'Signup'}</Text>
            <View style={globalStyles.form}>
                <View style={globalStyles.inputs}>
                    <TextInput style={globalStyles.input} placeholder="Email" autoCapitalize="none" onChangeText={setEmail} />
                    <TextInput secureTextEntry={true} style={globalStyles.input} placeholder="Password" onChangeText={setPassword} />
                    {!isLogin && <TextInput secureTextEntry={true} style={globalStyles.input} placeholder="Confirmer password" onChangeText={setPassword} />}
                    <Text style={[globalStyles.message, {color: isError ? 'red' : 'green'}]}>{message ? getMessage() : null}</Text>
                    <TouchableOpacity style={globalStyles.button} onPress={onSubmit}>
                        <Text style={globalStyles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={globalStyles.buttonAlt} onPress={onChange}>
                        <Text style={globalStyles.buttonAltText}>{isLogin ? 'Sign Up' : 'Log In'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


export default AuthScreen;