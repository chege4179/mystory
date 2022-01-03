import React, { useEffect, useLayoutEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, ToastAndroid } from "react-native";
import { Avatar, Divider } from "react-native-elements";
import BaseURL from "../components/BaseURL";
import ArticleCard from "../components/ArticleCard";
import axios from "axios";
import { capitalize } from "../Utilities/HelperFunctions";

const AuthorProfileScreen = ({ navigation,route }) => {
     const { username } = route.params
     const [MyPosts,setMyPosts] = useState([])
     const [totalPosts,setTotalPosts] = useState(0)
     const [totalFollowers,setTotalFollowers] = useState(0)
     const [totalFollowing,setTotalFollowing] = useState(0)
     const [userInfo,setUserInfo] = useState({})
     useLayoutEffect(() => {
          navigation.setOptions({
               headerTitle:username
          })
     },[])
     const FetchAuthorPosts = () => {
          axios.get(`${BaseURL}/post/author?username=${username}`)
               .then((res) =>{
                    if (res.data.success){
                         setMyPosts(res.data.posts)
                         setTotalPosts(res.data.posts.length)
                    }else {
                         setMyPosts([])
                         setTotalPosts(0)
                    }
               })
               .catch((err) => {
                    console.log(err)
                    ToastAndroid.show(err.message,ToastAndroid.SHORT)
               })
     }
     const FetchFollowersAndFollowing = () => {
          axios.get(`${BaseURL}/follower/all?username=${username}`)
               .then((res) => {
                    if (res.data.success){
                         setTotalFollowers(res.data.followers.length)
                         setTotalFollowing(res.data.following.length)
                    }else {
                         setTotalFollowers(0)
                         setTotalFollowing(0)
                         ToastAndroid.show(res.data.msg,ToastAndroid.SHORT)
                    }

               })
               .catch((error) => {
                    console.log(error)
                    ToastAndroid.show(error.message,ToastAndroid.SHORT)
               })
     }
     const FetchUserInfo = () =>{
          axios.get(`${BaseURL}/user/info?username=${username}`)
               .then((res) => {
                    if (res.data.success){
                         setUserInfo(res.data.user)
                    }else {
                         setUserInfo({})
                         ToastAndroid.show(res.data.msg,ToastAndroid.SHORT)
                    }

               })
               .catch((err) => {
                    console.log(err);
                    ToastAndroid.show(err.message,ToastAndroid.SHORT)

               })
     }
     navigation.addListener('focus',() => {
          FetchUserInfo()
          FetchAuthorPosts()
          FetchFollowersAndFollowing()
     })

     useEffect(() => {
          FetchUserInfo()
          FetchAuthorPosts()
          FetchFollowersAndFollowing()
     },[])



     return (
          <View style={styles.container}>
               <View style={styles.profileTop}>
                    <View style={styles.profileTopLeft}>
                         <Avatar
                              rounded={true}
                              size='large'
                              avatarStyle={styles.profileImage}
                              source={{ uri:`${BaseURL}${userInfo.profile_imageUrl}` }}/>
                    </View>

                    <View style={styles.profileTopRight}>
                         <View>
                              <Text style={styles.numberInfo}>{totalPosts}</Text>
                              <Text style={styles.numberText}>Posts</Text>
                         </View>
                         <View>
                              <Text style={styles.numberInfo}>{totalFollowers}</Text>
                              <Text style={styles.numberText}>Followers</Text>
                         </View>
                         <View>
                              <Text style={styles.numberInfo}>{totalFollowing}</Text>
                              <Text style={styles.numberText}>Following</Text>
                         </View>
                    </View>
               </View>
               <View style={styles.profileTopLeftBottom}>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.fullname}>{userInfo.fullname}</Text>
               </View>

               <View style={styles.profileCentre}>

                    <Text style={styles.myposts}>{capitalize(username)}'s Posts</Text>
                    <Divider orientation='horizontal' width={2} style={{ marginHorizontal:20, }}/>

                    <FlatList
                         style={styles.flatlist}
                         data={MyPosts}
                         keyExtractor={(post) => post.id}
                         renderItem={(post) => {
                              return(
                                   <ArticleCard
                                        postImageUrl={post.item.post_imageUrl}
                                        posttitle={post.item.post_title}
                                        postBody={post.item.post_body}
                                        views={post.item.views}
                                        likes={post.item.likes}
                                        postedAt={post.item.posted_at}
                                        postedBy={post.item.posted_by}
                                        postedOn={post.item.posted_on}
                                   />)
                         }}/>
               </View>
          </View>
     );
};
const styles = StyleSheet.create({

     container: {
          flex: 1,
     },
     profileTop:{
          width:'100%',
          flexDirection:'row',
          paddingHorizontal:20,
          paddingVertical:10,
     },
     profileTopLeft:{
          flex:0.3,
     },
     profileTopRight:{
          flex:0.7,
          marginLeft:20,
          flexDirection:'row',
          justifyContent:'space-evenly',

     },
     username:{
          fontSize:19,
          fontWeight:'700',

     },
     fullname:{
          fontSize:17
     },
     profileCentre:{
          marginBottom:5


     },
     myposts:{
          fontSize:20,
          fontWeight:'bold',
          paddingBottom:5,
          marginLeft:20

     },
     flatlist:{
          paddingBottom:5
     },
     profileTopLeftBottom:{
          paddingHorizontal:20,
          paddingVertical:5

     },
     numberInfo:{
          fontSize:20,
          fontWeight:'bold',
          textAlign:'center'

     },
     numberText:{
          fontSize:17,
          fontWeight:'600'
     }
});
export default AuthorProfileScreen;
