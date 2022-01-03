import React, { useState } from "react";

import { Text, View, StyleSheet, TouchableOpacity,KeyboardAvoidingView,ToastAndroid } from "react-native";
import { Button, Input } from "react-native-elements";
import axios from "axios";
import BaseURL from "../components/BaseURL";
import ActivityLoader from "../components/ActivityLoader";

const SignUpScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [fullname, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [conpassword, setConpassword] = useState('');
    const [Loader,setLoader] = useState(false)
    const GoToLoginScreen = () => {
        navigation.navigate('LoginScreen')
    }
    const SignUp =() => {
      if (username ==='' || fullname ===''
        || password ==='' || conpassword === ''){
        ToastAndroid.show('Please fill in all the fields',ToastAndroid.SHORT)

      }else {
           setLoader(true)
        if (password !== conpassword){
          ToastAndroid.show('Passwords dont match',ToastAndroid.SHORT)
        }else {
          axios.post(`${BaseURL}/user/signup`,{
            username,password,fullname
          }).then((res) => {
               setLoader(false)
               ToastAndroid.show(res.data.msg,ToastAndroid.SHORT)
               if (res.data.success){
                    navigation.navigate('LoginScreen')
               }

          })
        }

      }
    }
    return (
      <KeyboardAvoidingView style={styles.container}>
        <ActivityLoader isLoading={Loader}/>
        <View style={styles.form}>
          <Input
            placeholder='username'
            leftIcon={{ type: 'feather', name: 'user' }}
            onChangeText={(text) =>setUsername(text)}
          />
          <Input
            placeholder='Full Name'
            leftIcon={{ type: 'feather', name: 'user' }}
            onChangeText={(text) =>setFullName(text)}
          />
          <Input
            placeholder='Password'
            leftIcon={{ type: 'font-awesome', name: 'lock' }}
            onChangeText={(text) =>setPassword(text)}
            secureTextEntry={true}
          />
          <Input
            placeholder='Confirm Password'
            leftIcon={{ type: 'font-awesome', name: 'lock' }}
            onChangeText={(text) =>setConpassword(text)}
            secureTextEntry={true}
          />
          <Button
            buttonStyle={{
              borderRadius:15,
                 backgroundColor:'black'
            }}
            title="Sign Up"
            onPress={SignUp}
          />
          <TouchableOpacity style={styles.gotologin} onPress={GoToLoginScreen}>
            <Text style={styles.login}>Go To Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

  },
  form:{
    width:'100%',
    padding:20
  },
  gotologin:{
    marginTop:50,
    alignItems:'center',
    justifyContent:'center',

  },
  login:{
    textDecorationLine: 'underline'
  }
});
export default SignUpScreen;
