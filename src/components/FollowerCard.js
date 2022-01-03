import React, { useEffect, useState } from "react";

import { Text, View, StyleSheet, Image, TouchableOpacity,Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import BaseURL from "./BaseURL";
import FastImage from "react-native-fast-image";
const FollowerCard = ({ username,type }) => {
     const [imageUrl,setImageUrl] = useState('')
     const navigation = useNavigation()
     useEffect(() => {
          getImageURL()
          return () => {

          }
     })
     const getImageURL = () => {
          axios.get(`${BaseURL}/user/profile?username=${username}`)
               .then((res) => {
                    setImageUrl(res.data.profileImageUrl)
               })
               .catch((err) => {
                    console.log(err);
                    setImageUrl('https://res.cloudinary.com/dhuqr5iyw/image/upload/v1640971757/mystory/profilepictures/default_y4mjwp.jpg')
               })
     }
     const UnFollowOrRemoveFollower = () => {
          if (type ==='followers'){

          }else if (type ==='following'){

          }

     }
     const GoToAuthorProfileScreen = () => {
          navigation.navigate('AuthorProfileScreen',{ username:username })

     }
     return (
          <TouchableOpacity style={styles.container} onPress={GoToAuthorProfileScreen}>
               <View style={styles.innerContainer}>
                    <FastImage source={{ uri:imageUrl }} style={styles.image}/>
                    <Text style={styles.username}>{username}</Text>
                    <TouchableOpacity style={styles.followingbutton} onPress={UnFollowOrRemoveFollower}>
                         <Text style={styles.innerFollowingText}>{ type ==='followers'? 'Remove Follower' : 'Unfollow'}</Text>
                    </TouchableOpacity>
               </View>

          </TouchableOpacity>
     );
};
const styles = StyleSheet.create({
     container: {
          // borderColor:'black',
          // borderWidth:1,
          // borderRadius:20,
          width:Dimensions.get('screen').width * 0.95,
          padding:5,
          marginVertical:5,
     },

     innerContainer:{
          flexDirection:'row',
          justifyContent:'space-between',
          alignItems:'center'

     },
     image:{
          height:56,
          width:56,
          borderRadius:28
     },
     followingbutton:{
          borderWidth:1,
          width:Dimensions.get('screen').width * 0.3,
          height:Dimensions.get('screen').width * 0.3 * 0.25,
          borderColor:'grey',
          borderRadius:7,
          alignItems:'center',
          justifyContent:'center'

     },
     username:{
          fontSize:16,
          fontWeight:'bold',
          textAlign:'left'

     },
     innerFollowingText:{

     }
});
export default FollowerCard;
