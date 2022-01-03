import React, { useEffect, useLayoutEffect, useState } from "react";
import {
     Text, View, StyleSheet, ScrollView, ToastAndroid,
     Image, TouchableOpacity, Dimensions,
     Modal, TextInput, Button, ActivityIndicator,
} from "react-native";
import axios from "axios";
import BaseURL from "../components/BaseURL";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import { Avatar, Divider, FAB } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { SelectUser } from "../ReduxStore/UserReducer";
import FastImage from "react-native-fast-image";

const PostScreen = ({ navigation,route }) => {
     const user= useSelector(SelectUser)
     const [postInfo,setPostInfo] = useState({})
     const { postTitle,postedBy } = route.params
     const [isModalVisible, setModalVisible] = useState(false);
     const [comment, setComment] = useState("");
     const [Allcomments,setAllComments] = useState([])
     const [isCommentPosted,setIsCommentPosted] = useState(false)
     const [isLiked,setIsLiked] = useState(false)
     const [likes,setLikes] = useState(0)
     const [views,setViews] = useState(0)
     const [FollowButtonVisibility,setFollowButtonVisibility] = useState(true)
     const [FollowButtonState,setFollowButtonState] = useState("Follow")
     const [animating,setAnimating] = useState(false)

     const toggleModalVisibility = () => {
          setModalVisible(!isModalVisible);
     };
     useLayoutEffect(() => {
          navigation.setOptions({
               headerTitle:postTitle
          })

     },[])
     useEffect(() => {
          FetchPostInfo()
          CheckFollowButtonVisibility()
          return () => {
               setPostInfo({})
          }
     }, [isCommentPosted,isLiked]);
     const CheckFollowButtonVisibility = () =>{
          if(user.username === postedBy){
               setFollowButtonVisibility(false)
          }else {
               setFollowButtonVisibility(true)
               CheckFollowButtonState()
          }
     }
     const CheckFollowButtonState = () => {
          axios.get(`${BaseURL}/follower/check?follower=${user.username}&following=${postedBy}`)
               .then((res) => {
                    if (res.data.isFollower){
                         setFollowButtonState('Following')
                    }else {
                         setFollowButtonState('Follow')
                    }
               })
     }
     const FetchComments = (id) => {
          axios.get(`${BaseURL}/comment/all?postid=${id}`)
               .then((resp) => {
                    setAllComments(resp.data.comments)
               })
               .catch((err) => {
                    console.log(err)
               })
     }
     const FetchLikeInfo = (id) => {
          axios.get(`${BaseURL}/like/check?postid=${id}&username=${user.username}`)
               .then((respp) => {
                    setIsLiked(respp.data.isLiked)

               }).catch((err) => {
               console.log(err)
          })
     }
     const FetchTotalLikes = (id) => {
          axios.get(`${BaseURL}/like/all?postid=${id}`)
               .then((resppp) => {
                    setLikes(resppp.data.likes)
               }).catch((err) => {
               console.log(err)
          })
     }
     const AddView = (id) => {
          axios.post(`${BaseURL}/view/add`,{
               postid:id,
               username:user.username,
          })
               .then((resp) => {

               })
               .catch((err) => {
                    console.log(err)
               })
     }
     const FetchViews = (id) => {
          axios.get(`${BaseURL}/view/all?postid=${id}`)
               .then((ressp) => {
                    setViews(ressp.data.views)
               })
               .catch((err) => {
                    console.log(err)
               })
     }
     const FetchPostInfo = () => {
          axios.get(`${BaseURL}/post/specific?title=${postTitle}&postedBy=${postedBy}`)
               .then((res) => {
                    if (res.data.success){
                         setPostInfo(res.data.post)
                         FetchLikeInfo(res.data.post.id)
                         FetchComments(res.data.post.id)
                         FetchTotalLikes(res.data.post.id)
                         AddView(res.data.post.id)
                         FetchViews(res.data.post.id)
                    }else {
                         ToastAndroid.show(res.data.msg,ToastAndroid.SHORT)
                    }
               })
     }
     const AddFollower = () => {
          axios.post(`${BaseURL}/follower/add`,
               {follower:user.username,following:postedBy})
               .then((res) => {
                    ToastAndroid.show(res.data.msg,ToastAndroid.SHORT)
                    if (res.data.success){
                         setFollowButtonState('Following')
                    }
               })
     }
     const RemoveFollower = () => {
          axios.post(`${BaseURL}/follower/remove`,
               { follower:user.username,following:postedBy})
               .then((res) => {
                    ToastAndroid.show(res.data.msg,ToastAndroid.SHORT)
                    if (res.data.success){
                         setFollowButtonState('Follow')
                    }
               })
     }
     const AddComment =() => {
          setAnimating(true)
          axios.post(`${BaseURL}/comment/add`,{
               comment:comment,
               username:user.username,
               postid:postInfo.id,
               postauthor:postInfo.posted_by
          })
               .then((res) => {
                    ToastAndroid.show(res.data.msg,ToastAndroid.SHORT)
                    if (res.data.success){
                         setAnimating(false)
                         setComment('')
                         setIsCommentPosted(true)
                         toggleModalVisibility()
                    }
                    setIsCommentPosted(false)
               })
               .catch((err) => {
                    console.warn(err)
               })
     }
     const LikeFunctionality =() => {
          if (isLiked){
               axios.post(`${BaseURL}/like/remove`,{
                    postid:postInfo.id,
                    username:user.username
               })
                    .then((res) => {
                         ToastAndroid.show(res.data.msg,ToastAndroid.SHORT)
                    })
                    .catch((err) => {
                         ToastAndroid.show(err.message,ToastAndroid.SHORT)
                    })
          }else {
               axios.post(`${BaseURL}/like/add`,{
                    postid:postInfo.id,
                    liker:user.username,
                    postedBy:postInfo.posted_by
               })
                    .then((res) => {
                         ToastAndroid.show(res.data.msg,ToastAndroid.SHORT)
                    })
                    .catch((err) => {
                         ToastAndroid.show(err.message,ToastAndroid.SHORT)
                    })
          }
          setIsLiked(!isLiked)
     }
     const FollowFunctionality = () => {
          setAnimating(true)
          if (FollowButtonState ==='Follow'){
               AddFollower()
               setAnimating(false)
          }else if (FollowButtonState ==='Following'){
               RemoveFollower()
               setAnimating(false)
          }
     }
     const GoToAuthorProfileScreen = () => {
          navigation.navigate('AuthorProfileScreen',{ username:postedBy })
     }
    return (
        <View style={styles.container}>
          <ScrollView>
               <FastImage source={{ uri:`${postInfo.post_imageUrl}` }}
               style={styles.image}/>
               <View style={styles.postBodyContainer}>
                    <View>
                         <Divider orientation='horizontal' width={2}/>
                         <Text style={styles.postTitle}>{postTitle}</Text>
                         <View style={styles.postTop}>
                              <View style={{ flexDirection:'row' }}>
                                   <Text style={{ fontSize:15, }}>Written By : </Text>
                                   <TouchableOpacity onPress={GoToAuthorProfileScreen}>
                                        <Text style={{ fontWeight:'bold' }}>{postedBy}</Text>
                                   </TouchableOpacity>
                              </View>
                              <View style={{ flexDirection:'row',justifyContent:'space-evenly' }}>
                                   <Text style={styles.datetime}>{postInfo.posted_on}</Text>
                                   <Text style={styles.datetime}>{postInfo.posted_at}</Text>
                              </View>
                         </View>
                         <Divider orientation='horizontal' width={2}/>
                         <View style={styles.belowDivider}>
                              <Text style={styles.icon}>{views} Views</Text>
                              <Text style={styles.icon}>{likes} likes</Text>
                              {
                                   FollowButtonVisibility && (
                                        <TouchableOpacity style={styles.followButton} onPress={FollowFunctionality}>
                                             <Text style={styles.followButtonText}>{FollowButtonState}</Text>
                                        </TouchableOpacity>
                                   )
                              }
                              <View style={styles.belowDividerIcons}>
                                   <TouchableOpacity onPress={LikeFunctionality}>
                                        <AntDesign name={ isLiked ? 'heart': "hearto" } size={23} style={styles.icon} color="black" />
                                   </TouchableOpacity>
                                   <TouchableOpacity>
                                        <Feather name='bookmark' size={23} style={styles.icon}/>
                                   </TouchableOpacity>
                                   <TouchableOpacity>
                                        <Entypo name='share' size={23} style={styles.icon}/>
                                   </TouchableOpacity>
                              </View>

                         </View>
                    </View>
                    <Text style={styles.postBody}>{postInfo.post_body}</Text>
                    <View style={styles.comments}>
                         <View style={{ flexDirection:'row',justifyContent:'space-around' }}>
                              <Text style={styles.commentsTitle}>Comments</Text>
                              <Text style={styles.NoOfComments}>{Allcomments.length} comments</Text>
                         </View>
                         <Divider orientation='horizontal' width={1}/>
                         {
                              Allcomments.length === 0 ? (<Text style={{ fontSize:17,fontWeight:'400' }}>No Comments Yet...Be the first</Text>):(
                                   <View>
                                        {
                                             Allcomments.map((comment,index) => {
                                                  return(
                                                       <View style={styles.commentContainer} key={index}>
                                                            <Avatar
                                                                 rounded
                                                                 source={{ uri: 'https://picsum.photos/300/300', }}
                                                            />
                                                            <Text style={styles.commentAuthor}>{comment.comment_poster}</Text>
                                                            <Text style={styles.commentInfo}>{comment.comment}</Text>
                                                       </View>
                                                  )
                                             })
                                        }
                                   </View>
                              )
                         }
                    </View>
               </View>
          </ScrollView>
             <FAB
               onPress={toggleModalVisibility}
               color='black'
               title={<MaterialCommunityIcons name='message-reply-text' size={30} color='white'/>}
               style={styles.fab}
               size='large'

             />
             <Modal animationType="slide"
                    transparent visible={isModalVisible}
                    presentationStyle="overFullScreen"
                    onDismiss={toggleModalVisibility}>
                  <View style={styles.viewWrapper}>
                       <View style={styles.modalView}>
                            <TextInput placeholder="Comment..."
                                       value={comment} style={styles.textInput}
                                       onChangeText={(value) => setComment(value)} />

                            {/** This button is responsible to close the modal */}
                            <View style={{ flexDirection:'row',justifyContent:'space-evenly',width:'100%' }}>
                                 <Button title="Close" onPress={toggleModalVisibility} />
                                 <Button title="Comment" onPress={AddComment} />
                            </View>

                       </View>
                  </View>
             </Modal>
             <ActivityIndicator
                  animating = {animating}
                  color = 'black'
                  size = "large"
                  style = {styles.activityIndicator}/>
        </View>
    );
};
const styles = StyleSheet.create({
     container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          margin:10,
          marginTop:20,
     },
     image:{
          width:'100%',
          height:400,
          borderColor:'black',
          borderWidth:1,
          marginBottom:15
     },
     postTitle:{
       fontSize:25,
       textAlign:'center',
          fontWeight:'bold',
          paddingTop:10,
          paddingBottom:10,
     },
     postBodyContainer:{
       margin:10,
     },
     postBody:{
       fontSize:17,
          paddingBottom:15,
     },
     postTop:{
       flexDirection:'row',
          justifyContent:'space-between',
          margin:10,

     },
     datetime:{
       paddingRight:10
     },
     belowDivider:{
          flex:0.6,
          flexDirection:'row',
          justifyContent:'space-evenly',
          paddingBottom:10,
          paddingTop:10
     },
     belowDividerIcons:{
       flexDirection:'row',
       justifyContent:'space-evenly',
     },
     icon:{
       padding:8,
     },
     fab:{
          position:'absolute',
          top:Dimensions.get('screen').height * 0.7,
          left:Dimensions.get('screen').width * 0.75,
          justifyContent:'center',
          alignItems:'center',
          zIndex:1,
     },
     viewWrapper: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
     },
     modalView: {
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          elevation: 5,
          transform: [{ translateX: -(Dimensions.get("window").width * 0.4) },
               { translateY: -90 }],
          height: 180,
          width: Dimensions.get("window").width * 0.8,
          backgroundColor: "#fff",
          borderRadius: 7,
     },
     textInput: {
          width: "80%",
          borderRadius: 5,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderColor: "rgba(0, 0, 0, 0.2)",
          borderWidth: 1,
          marginBottom: 8,
     },
     commentsTitle:{
       fontSize:20,
          fontWeight:'bold',

     },
     NoOfComments:{
          fontSize:17,
          fontWeight:'500',

     },
     commentContainer:{
       flexDirection:'row',
          marginTop:10,

     },
     commentAuthor:{
          fontWeight:'600',
          fontSize:17,
          marginLeft:15,
          marginRight:20,

     },
     commentInfo:{
          fontSize:16,
     },
     followButton:{
       alignItems:'center',
          justifyContent:'center',
          width:70,
          height:30,
          borderRadius:10,
          backgroundColor:'black'

     },
     followButtonText:{
       fontSize:15,
          color:'white'

     },
     activityIndicator: {
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
     }

});
export default PostScreen;
