import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Card } from "react-native-elements";
import BaseURL from "./BaseURL";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import { SavePostToSavedPosts, SharePost } from "../Utilities/HelperFunctions";
import axios from "axios";
import { useSelector } from "react-redux";
import { SelectUser } from "../ReduxStore/UserReducer";
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from "react-native-fast-image";



const ArticleCard = ({ posttitle,postImageUrl,postBody,postedOn,postedAt,postedBy,views,likes,post,isSavedPostScreen }) => {
     const user = useSelector(SelectUser)
     const navigation = useNavigation()
     const [profileImageUrl,setProfileImageUrl] = useState("")
     const GoToPostScreen = () => {
          navigation.navigate('PostScreen',{ postTitle:posttitle,postedBy })

     }
     const DeleteFromSavedPosts = () => {
          AsyncStorage.getItem('posts',(err,data) => {
               if (err){
                    console.log(err);
               }else {
                    const posts = JSON.parse(data)
                    const newSavedPosts = posts.filter((post) => post.post_title !== posttitle)
                    const newData = JSON.stringify(newSavedPosts)
                    AsyncStorage.setItem('posts',newData)


               }

          })

     }
     useEffect(() => {
          axios.get(`${BaseURL}/user/profile?username=${postedBy}`)
               .then((res) => {
                    if (res.data.success){
                         setProfileImageUrl(res.data.profileImageUrl)
                    }else {

                    }

               })
               .catch((err) => {
                    console.log(err)
                    setProfileImageUrl("https://res.cloudinary.com/dhuqr5iyw/image/upload/v1640971757/mystory/profilepictures/default_y4mjwp.jpg")
               })
     },[])
     return (
       <TouchableOpacity onPress={GoToPostScreen}>
            <Card style={styles.container}>
                 <FastImage source={{ uri:`${postImageUrl}` }}
                        style={{ width:'100%',height:150,borderRadius:10 }}/>
                 <Card.Title style={styles.postTitle}>{posttitle}</Card.Title>
                 <View style={styles.bottomCard}>
                      <Text>By : {postedBy}</Text>
                      <Image source={{ uri:`${BaseURL}${profileImageUrl}` }} style={styles.profileImage}/>
                      <View style={styles.icons}>
                           <Text style={styles.icon}>{views} Views</Text>
                           {
                                isSavedPostScreen && (
                                     <TouchableOpacity onPress={DeleteFromSavedPosts}>
                                          <AntDesign name='delete' size={23} style={styles.icon}/>
                                     </TouchableOpacity>
                                )
                           }
                           {
                                user?.username !== postedBy && !isSavedPostScreen && (
                                <TouchableOpacity onPress={() => SavePostToSavedPosts(post)}>
                                     <Feather name='bookmark' size={23} style={styles.icon}/>
                                </TouchableOpacity>
                                )
                           }

                           <TouchableOpacity onPress={() => SharePost(posttitle,postedBy)}>
                                <Entypo name='share' size={23} style={styles.icon}/>
                           </TouchableOpacity>


                      </View>
                 </View>
            </Card>
       </TouchableOpacity>

     );
};
const styles = StyleSheet.create({
     container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",

     },
     icons:{
          flexDirection:'row',
          justifyContent:'space-evenly'
     },
     bottomCard:{
          flexDirection:'row',
          justifyContent:'space-between'
     },
     icon:{
          padding:5
     },
     postTitle:{
          fontSize:20,

     },
     profileImage:{
          width:35,
          height:35,
          borderRadius:17.5,
          resizeMode:'contain',
          marginRight:40,

     }
});
export default ArticleCard;
