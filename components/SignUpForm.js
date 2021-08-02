import React from 'react'
import { Formik } from 'formik'
import { Button, TextInput, View } from 'react-native';
import { globalStyles } from '../styles/global.js';

const SignUpForm = () => (
    <View style = {globalStyles.container}>
        <Formik
            initialValues = {{ email: '', password: '', passwordRepeat: ''}}
            onSubmit= {(values) => console.log(values)}>

            {({ handleChange, handleBlur, handleSubmit, values}) => (
                <View>
                    <TextInput
                        style={globalStyles.input}
                        onChangeText = {handleChange('email')}
    //                    onBlur={handleBlur('email')}
                        placeholder= 'Adresse mail'
                        value= {values.email} />

                    <TextInput
                        style={globalStyles.input}
                        onChangeText = {handleChange('password')}
    //                  onBlur={handleBlur('email')}
                        placeholder= 'Password'
                        value= {values.password} />

                    <TextInput
                        style={globalStyles.input}
                        onChangeText = {handleChange('passwordRepeat')}
    //                  onBlur={handleBlur('email')}
                        placeholder= 'Confirmer votre mot de passe'
                        value= {values.passwordRepeat} />

                    <Button color='maroon' onPress={handleSubmit} title="Submit"  />
                </View>
            )}
        </Formik>
    </View>
    
)

export default SignUpForm