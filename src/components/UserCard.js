import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { SelectUser } from "../ReduxStore/UserReducer";
import FastImage from "react-native-fast-image";

const UserCard = ({ user }) => {
     const LoggedInUser = useSelector(SelectUser)
     const navigation = useNavigation()
     const GoToAuthorProfileScreen = () => {
          navigation.navigate('AuthorProfileScreen',{ username:user.username })
     }
     const UnFollowOrRemoveFollower = () => {

     }
     return (
          <TouchableOpacity style={styles.container} onPress={GoToAuthorProfileScreen}>
               <View style={styles.innerContainer}>
                    <FastImage source={{ uri:user.profile_imageUrl }} style={styles.image}/>
                    <View>
                         <Text style={styles.username}>{user.username}</Text>
                         <Text style={styles.fullname}>{user.fullname}</Text>
                    </View>
                    <TouchableOpacity style={styles.followingbutton} onPress={UnFollowOrRemoveFollower}>
                         <Text style={styles.innerFollowingText}>Follow</Text>
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
     fullname:{
          fontSize:16,
          textAlign:'left'
     },
     innerFollowingText:{

     }
});
export default UserCard;
