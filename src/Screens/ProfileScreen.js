import React, { useEffect, useLayoutEffect, useState } from "react";
import {
     Text,
     View,
     StyleSheet,
     FlatList,
     ScrollView,
     TouchableOpacity,
     Pressable,
     TextInput,
     Button, Modal, Dimensions, Image, ToastAndroid,
} from "react-native";
import { Avatar } from "react-native-elements";
import { useSelector } from "react-redux";
import { SelectUser } from "../ReduxStore/UserReducer";
import BaseURL from "../components/BaseURL";
import { Divider } from "react-native-elements";
import axios from "axios";
import ArticleCard from "../components/ArticleCard";
import Entypo from "react-native-vector-icons/Entypo";
import { ShareAuthorProfile } from "../Utilities/HelperFunctions";
import MaterialCommunityIcon from "react-native-paper/src/components/MaterialCommunityIcon";
import * as ImagePicker from "react-native-image-picker";
import ActivityLoader from "../components/ActivityLoader";

const ProfileScreen = ({ navigation }) => {
     const user = useSelector(SelectUser)
     const [MyPosts,setMyPosts] = useState([])
     const [totalPosts,setTotalPosts] = useState(0)
     const [totalFollowers,setTotalFollowers] = useState(0)
     const [totalFollowing,setTotalFollowing] = useState(0)
     const [isModalVisible, setModalVisible] = useState(false)
     const [postphoto, setPostphoto] = useState(null);
     const [photoURI,setPhotoURI] =useState('')
     const [Loader,setLoader] = useState(false)
     const toggleModalVisibility = () => {
          setModalVisible(!isModalVisible);
     };
     const UpdateProfile = () => {
         toggleModalVisibility()

     }
     const UpdateProfilePicture = () => {
         ImagePicker.launchImageLibrary({ mediaType:'photo'}, (response) => {
              if (response.didCancel){
                   setPhotoURI('')
                   setPostphoto(null)
              } else{
                   setPhotoURI(response?.assets[0].uri)
                   setPostphoto(response?.assets[0])
                   UpdateProfile()
              }

         })
     }

    useLayoutEffect(() => {
         navigation.setOptions({
              headerTitle:user?.username,
              headerRight:() => {
                   return(
                        <View style={{ flexDirection:'row' }}>
                             <TouchableOpacity onPress={UpdateProfilePicture} style={{ paddingHorizontal:20, }}>
                                  <MaterialCommunityIcon name='camera-plus-outline' size={30} color='black' direction='rtl' />
                             </TouchableOpacity>
                             <TouchableOpacity style={{ marginRight:20 }} onPress={ShareAuthorProfile}>
                                  <Entypo name='share' size={30}/>
                             </TouchableOpacity>
                        </View>

                   )
              }
         })
    })
    const FetchAuthorPosts = () => {
          setLoader(true)
        axios.get(`${BaseURL}/post/author?username=${user?.username}`)
             .then((res) =>{
                  setLoader(false)
                  setMyPosts(res.data.posts)
                  setTotalPosts(res.data.posts.length)
             })
             .catch((err) => {
               console.log(err)
             })
    }
    const FetchFollowersAndFollowing = () => {
         axios.get(`${BaseURL}/follower/all?username=${user.username}`)
              .then((res) => {
                   setTotalFollowers(res.data.followers.length)
                   setTotalFollowing(res.data.following.length)
              })
              .catch((error) =>{
                   console.log(error)
              })
    }
    navigation.addListener('focus',() => {
        FetchAuthorPosts()
         FetchFollowersAndFollowing()
    })
     const CheckFollowers = () => {

          navigation.navigate('FollowerScreen',{ type:'followers' })
     }
     const CheckFollowing = () => {
          navigation.navigate('FollowerScreen',{ type:'following' })
     }
     const PostNewProfilePicture = () => {
          if (postphoto === null){
               ToastAndroid.show('Please select an Image',ToastAndroid.SHORT)
          }else {
               const request = createFormData(postphoto,{ username:user.username })
               axios.post(`${BaseURL}/user/updateProfilePhoto`,request)
                    .then((res) => {
                         ToastAndroid.show(res.data.msg,ToastAndroid.SHORT)
                    })
                    .catch((err) => {
                         console.log(err);
                         ToastAndroid.show(err.message,ToastAndroid.SHORT)
                    })
          }

     }
     const createFormData = (photo, body) => {
          const data = new FormData();

          data.append("photo", {
               name: photo.fileName,
               type: photo.type,
               uri:
                    Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
          });

          Object.keys(body).forEach(key => {
               data.append(key, body[key]);
          });

          return data;
     };

    useEffect(() => {
         FetchAuthorPosts()
         FetchFollowersAndFollowing()
    },[])

    return (
      <View style={styles.container}>
           <ActivityLoader isLoading={Loader}/>

                <View style={styles.profileTop}>
                     <View style={styles.profileTopLeft}>
                          <Avatar
                               rounded={true}
                               size='large'
                               avatarStyle={styles.profileImage}
                               source={{ uri:user?.profile_imageUrl }}/>

                     </View>
                     <View style={styles.profileTopRight}>
                          <View>
                               <Text style={styles.numberInfo}>{totalPosts}</Text>
                               <Text style={styles.numberText}>Posts</Text>
                          </View>
                          <TouchableOpacity onPress={CheckFollowers}>
                               <View>
                                    <Text style={styles.numberInfo}>{totalFollowers}</Text>
                                    <Text style={styles.numberText}>Followers</Text>
                               </View>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={CheckFollowing}>
                               <View>
                                    <Text style={styles.numberInfo}>{totalFollowing}</Text>
                                    <Text style={styles.numberText}>Following</Text>
                               </View>
                          </TouchableOpacity>


                     </View>
                </View>
                <View style={styles.profileTopLeftBottom}>
                     <Text style={styles.username}>{user?.username}</Text>
                     <Text style={styles.fullname}>{user?.fullname}</Text>
                </View>

                <View style={styles.profileCentre}>

                     <Text style={styles.myposts}>My Posts</Text>
                     <Divider orientation='horizontal' width={2} style={{ marginHorizontal:20, }}/>
                     <FlatList
                          data={MyPosts}
                          keyExtractor={( item ) => item.id}
                          renderItem={({ item }) => {
                               return (
                                    <ArticleCard
                                                 postImageUrl={item.post_imageUrl}
                                                 posttitle={item.post_title}
                                                 postBody={item.post_body}
                                                 views={item.views}
                                                 likes={item.likes}
                                                 postedAt={item.posted_at}
                                                 postedBy={item.posted_by}
                                                 postedOn={item.posted_on}
                                    />)
                          }}/>
                </View>

           <Modal animationType="slide"

                  transparent visible={isModalVisible}
                  presentationStyle="overFullScreen"
                  onDismiss={toggleModalVisibility}>
                <View style={styles.viewWrapper}>
                     <Text>Update Profile Picture</Text>
                     <View style={styles.modalView}>
                          {
                               postphoto &&(<Image source={{ uri:photoURI }} style={{ width:200,height:100,marginBottom:10 }}/>)
                          }
                          <View style={{ flexDirection:'row',justifyContent:'space-evenly',width:'100%',paddingHorizontal:15 }}>
                               <TouchableOpacity onPress={toggleModalVisibility} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Close</Text>
                               </TouchableOpacity>
                               <TouchableOpacity onPress={UpdateProfilePicture} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Pick Photo</Text>
                               </TouchableOpacity>
                               <TouchableOpacity onPress={PostNewProfilePicture} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Update Photo</Text>
                               </TouchableOpacity>

                          </View>

                     </View>
                </View>
           </Modal>

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
          height: 250,
          width: Dimensions.get("screen").width * 0.87,
          backgroundColor: "#fff",
          borderRadius: 7,
     },
     modalButton:{
       borderColor:'grey',
       borderWidth:1,
       borderRadius:5,
          marginHorizontal:20,
          width:Dimensions.get("screen").width * 0.25

     },
     modalButtonText:{
       fontSize:16,
          fontWeight:'700',
          flexWrap:'wrap',
          textAlign:'center'


     }
});
export default ProfileScreen;
