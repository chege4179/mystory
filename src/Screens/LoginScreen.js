import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity,ToastAndroid } from "react-native";
import { Input,Button } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { SelectUser } from "../ReduxStore/UserReducer";
import axios from "axios";
import BaseURL from "../components/BaseURL";
import { UserActions } from "../ReduxStore/UserConstants";
import messaging from '@react-native-firebase/messaging'
import AsyncStorage from "@react-native-async-storage/async-storage";
import ActivityLoader from "../components/ActivityLoader";


const LoginScreen= ({ navigation }) => {
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const [Loader,setLoader] = useState(false)
     const user = useSelector(SelectUser)
     const dispatch = useDispatch()
     const GoToSignUpScreen = () => {
          navigation.navigate('SignUpScreen')
     }
     const Login = async () => {
         if (username === '' || password === ''){
              ToastAndroid.show('Please fill in all the fields',ToastAndroid.SHORT)
         }else {
              setLoader(true)
              const token = await messaging().getToken()

              axios.post(`${BaseURL}/user/login`,{ username,password,deviceId:token })
                   .then((res) => {
                        setLoader(false)
                        ToastAndroid.show(res.data.msg,ToastAndroid.SHORT)
                        if (res.data.success){
                             dispatch({
                                  type:UserActions.LOGIN_SUCCESS,
                                  payload:res.data.user
                             })
                             AsyncStorage.setItem('user',JSON.stringify(res.data.user))
                        }
                   })
                   .catch(e => {
                        console.warn(e.message);
                   })

         }
     }

  return (
    <View style={styles.container}>
         <ActivityLoader isLoading={Loader}/>
      <View style={styles.form}>

        <Input
          placeholder='Username'
          leftIcon={{ type: 'feather', name: 'user' }}
          onChangeText={(text) => setUsername(text)}
        />

        <Input
          placeholder='Password'
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />
        <Button
          buttonStyle={{
            borderRadius:15,
            backgroundColor:'black'
          }}
          onPress={Login}
          title="Login"
        />
        <TouchableOpacity style={styles.gotosignup} onPress={GoToSignUpScreen}>
          <Text style={styles.signup}>Go To Sign Up</Text>
        </TouchableOpacity>
      </View>

    </View>
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
  gotosignup:{
    marginTop:50,
    alignItems:'center',
    justifyContent:'center',

  },
  signup:{
    textDecorationLine: 'underline'
  }

});
export default LoginScreen;
