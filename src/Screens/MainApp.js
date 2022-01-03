import React, { useEffect } from "react";

import {  StyleSheet } from "react-native";
import LoginScreen from "./LoginScreen";
import SignUpScreen from "./SignUpScreen";
import DashBoardScreen from "./DashBoardScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { SelectUser } from "../ReduxStore/UserReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserActions } from "../ReduxStore/UserConstants";
import AddPostScreen from "./AddPostScreen";
import PostScreen from "./PostScreen";
import messaging from "@react-native-firebase/messaging";
import SearchScreen from "./SearchScreen";
import AuthorProfileScreen from "./AuthorProfileScreen";
import FollowerScreen from "./FollowerScreen";
import DraftsScreen from "./DraftsScreen";
const Stack = createStackNavigator()

const MainApp = () => {
     const user = useSelector(SelectUser)
     const dispatch = useDispatch()
     useEffect(() => {
           AsyncStorage.getItem('user',(err,data) => {
               if (err){
                 console.warn("No data")
               }else {
                   if (err){
                        console.log('ASYNC STORAGE ERROR',err)
                   }else {
                       const userdata = JSON.parse(data)

                       if (user ===null){
                           dispatch({
                             type:UserActions.LOGIN_SUCCESS,
                             payload:userdata,
                           })
                       }
                   }
               }
          })
     },[])
     const FetchCurrentDeviceInfo = () => {

     }
     useEffect(() => {
          const unsubscribe = messaging().onMessage(async remoteMessage => {
               console.log("MESSAGE HANDLED IN THE FOREGROUND")
          });
          return unsubscribe
     },[])
     useEffect(() => {
          messaging().onNotificationOpenedApp(remoteMessage => {
               console.log('Notification caused app to open from background state:',);

          });
     },[])
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {
          user ? (
            <>
                 <Stack.Screen name='DashBoardScreen'component={DashBoardScreen}options={{
                      headerShown:false
                 }}/>
                 <Stack.Screen name='AddPostScreen'component={AddPostScreen}options={{
                      headerShown:false
                 }}/>
                 <Stack.Screen name='PostScreen'component={PostScreen}/>
                 <Stack.Screen name='SearchScreen'component={SearchScreen}/>
                 <Stack.Screen name='AuthorProfileScreen'component={AuthorProfileScreen}/>
                 <Stack.Screen name='FollowerScreen' component={FollowerScreen}/>
                 <Stack.Screen name='DraftsScreen' component={DraftsScreen}/>
            </>

          ):(
            <>
              <Stack.Screen name='LoginScreen'component={LoginScreen} options={{
                headerShown:false
              }}/>
              <Stack.Screen name='SignUpScreen' component={SignUpScreen}options={{
                headerShown:false
              }}/>
            </>
          )
        }


      </Stack.Navigator>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

  },
});
export default MainApp;
