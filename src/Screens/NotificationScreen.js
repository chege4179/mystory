import React, { useEffect, useLayoutEffect, useState } from "react";

import { Text, View, StyleSheet, TouchableOpacity, FlatList, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SelectUser } from "../ReduxStore/UserReducer";
import { UserActions } from "../ReduxStore/UserConstants";
import messaging from "@react-native-firebase/messaging";
import axios from "axios";
import BaseURL from "../components/BaseURL";
import NotificationCard from "../components/NotificationCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ActivityLoader from "../components/ActivityLoader";

const NotificationScreen = ({ navigation }) => {
     const dispatch = useDispatch()
     const user = useSelector(SelectUser)
     const [notifications,setNotifications] = useState([])
     const [Loader,setLoader] = useState(false)
     navigation.addListener("focus",() => {
          FetchNotifications()
     })
     const Logout = () => {
          setLoader(true)
          messaging().getToken()
            .then((token) => {
               axios.post(`${BaseURL}/user/logout`,{
                    deviceId:token,
                    username:user.username
               })
                 .then((res) => {
                      setLoader(false)
                      ToastAndroid.show(res.data.msg,ToastAndroid.SHORT)
                      dispatch({
                           type:UserActions.LOGOUT_SUCCESS
                      })
                      AsyncStorage.removeItem('user')
                 })
          })

     }
     useLayoutEffect(() => {
          navigation.setOptions({
               headerRight:() => {
                    return(
                      <TouchableOpacity onPress={Logout} >
                           <Text style={styles.logout}>Logout</Text>
                      </TouchableOpacity>
                    )
               }
          })
     })
     const FetchNotifications = () => {
          setLoader(true)
          axios.get(`${BaseURL}/notification/all?username=${user.username}`)
               .then((res) => {
                    setLoader(false)
                    setNotifications(res.data.notifications)

               })
               .catch((err) => {
                    console.log(err)
               })
     }
     useEffect(() => {
          FetchNotifications()
     },[])
     useEffect(() => {
          const unsubscribe = messaging().onMessage(async remoteMessage => {
               FetchNotifications()
          });
          return unsubscribe
     },[])

     return (
       <View style={styles.container}>
            <ActivityLoader isLoading={Loader}/>
            {
                 notifications?.length === 0 ? (
                      <Text>No Notifications Yet</Text>
                 ):(
                      <FlatList
                           data={notifications.sort((a,b) => b.id -a.id)}
                           keyExtractor={(notification) => notification.id }
                           renderItem={(notification) => {
                                return(
                                     <NotificationCard
                                          notificationType={notification.item.type}
                                          notificationInitiator={notification.item.notification_initiator}
                                          comment={notification.item.comment} postId={notification.item.post_id}

                                     />)
                           }}/>
                 )
            }

       </View>
     );
};
const styles = StyleSheet.create({
     container: {
          flex: 1,
          width:"100%",
          alignItems: "center",
          justifyContent: "center",

     },
     logout:{
          marginRight:20,
          fontWeight:'bold',
          fontSize:20,

     }
});
export default NotificationScreen;
