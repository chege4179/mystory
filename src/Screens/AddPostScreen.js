import React, { useEffect, useState } from "react";
import {
     Text, ToastAndroid, TextInput, View, StyleSheet,
     Image, TouchableOpacity, ScrollView, Alert, BackHandler } from "react-native";
import * as ImagePicker from 'react-native-image-picker'
import BaseURL from "../components/BaseURL";
import axios from "axios";
import { useSelector } from "react-redux";
import { SelectUser } from "../ReduxStore/UserReducer";
import moment from "moment";
import ActivityLoader from "../components/ActivityLoader";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddPostScreen = ({ navigation,route }) => {
    const user = useSelector(SelectUser)
     const { draft }= route.params
    const [postphoto, setPostphoto] = useState(null);
    const [photoURI,setPhotoURI] =useState('')
    const [postbody,setPostBody] = useState('')
    const [posttitle,setPostTitle] = useState('')
    const [Loader,setLoader] = useState(false)
     useEffect(() => {
          if (draft){
               setPostBody(draft.postBody)
               setPostTitle(draft.posttitle)
          }
     },[])

    const AddPhoto =() => {
           ImagePicker.launchImageLibrary({ mediaType:'photo'}, (response) => {
                if (response.didCancel){
                     setPhotoURI('')
                     setPostphoto(null)
                } else{
                     setPhotoURI(response?.assets[0].uri)
                     setPostphoto(response?.assets[0])
                }
           })
    }
    const OpenDrafts = () => {
         navigation.navigate('DraftsScreen')
    }
    const PostAnArticle = () => {

      if (posttitle ==='' || postbody === '' || photoURI ==='' || postphoto === null){
        ToastAndroid.show('Please fill in all in everything and make sure you have picked an image for your post',ToastAndroid.SHORT)
      }else {
           setLoader(true)
        const body = createFormData(postphoto,{
             postTitle:posttitle,
             postBody:postbody,
             postedBy: user.username,
             postedAt: moment().format('h:mm:ss a'),
             postedOn:moment().format('L'),
             comments:'[]',
             views:0,
             likes:0,
        })
          axios.post(`${BaseURL}/post/upload`,body)
            .then((res) => {
                 setLoader(false)
                 ToastAndroid.show(res.data.msg,ToastAndroid.SHORT)
                 if (res.data.success){
                      setPostTitle('')
                      setPostBody('')
                      setPhotoURI('')
                      setPostphoto(null)
                      navigation.navigate('DashBoardScreen')
                 }

            })
               .catch((err) => {
               console.warn(err)
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
    const AddAsADraft = () => {
         const draftPost = {
              postbody,
              posttitle,
              id:Math.floor((Math.random() * 1000000) + 1)
         }
         AsyncStorage.getItem('drafts',(err,data) => {
              if(err){
                   console.log(err);
              }else {
                   if (data === null){
                        let newDrafts = [draftPost]
                        AsyncStorage.setItem('drafts',JSON.stringify(newDrafts))
                        ToastAndroid.show('Your post has been saved as a draft',ToastAndroid.SHORT)

                   }else {
                        let drafts = JSON.parse(data)
                        let newDrafts = [draftPost,...drafts]
                        AsyncStorage.setItem('drafts',JSON.stringify(newDrafts))
                        ToastAndroid.show('Your post has been added to the drafts',ToastAndroid.SHORT)
                   }
              }
         })
    }
     useEffect(() => {
     }, []);
     // const backAction = () => {
     //      if (posttitle !== '' || postbody !==''){
     //           Alert.alert(
     //                "Save Post Draft!",
     //                "Do you want to save this as a draft",
     //                [
     //                     {
     //                          text: "Cancel",
     //                          onPress: () => navigation.goBack(),
     //                          style: "cancel"
     //                     },
     //                     {
     //                          text: "YES",
     //                          onPress: AddAsADraft
     //                     }
     //                ]);
     //           return true;
     //      }
     //
     // };
     // const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return (
          <View style={styles.container}>
              <ActivityLoader isLoading={Loader}/>
              <View style={styles.posttop}>
                   {/*<TouchableOpacity style={styles.topbutton} onPress={OpenDrafts}>*/}
                   {/*     <Text style={styles.toptext}>Drafts</Text>*/}
                   {/*</TouchableOpacity>*/}
                  <TouchableOpacity style={styles.topbutton} onPress={AddPhoto}>
                      <Text style={styles.toptext}>Pick Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.topbutton} onPress={PostAnArticle}>
                      <Text style={styles.toptext}>Post</Text>
                  </TouchableOpacity>
              </View>
              <View style={styles.topform}>
                   { postphoto && (<Image source={{ uri:photoURI }} style={styles.postphoto}/>) }
                  <TextInput
                    placeholder='Title'
                    style={styles.posttitle}
                    numberOfLines={3}
                    multiline={true}
                    onChangeText={(text) => setPostTitle(text)}
                  />
              </View>
              <ScrollView style={styles.postbody}>
                  <TextInput
                    style={styles.postbodyinput}
                    placeholder='Write your Story'
                    multiline={true}
                    numberOfLines={150}
                    onChangeText={(text) => setPostBody(text)}
                  />
              </ScrollView>



          </View>
      );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin:8,
    alignItems:'center'

  },
  topform:{
    flexDirection:'row',
    padding:10,

  },
  postphoto:{
    width:100,
    height:100,
    marginRight:20,
    flex:0.3,
       borderWidth:1,
       borderColor:'black',
       borderRadius:10,
  },
  posttitle:{
    flex:0.7,
    fontSize:17,
       height:100,
       borderWidth:1,
       borderColor:'black',
       borderRadius:10,
  },
  postbody:{
    width:'100%',
    margin:10,
    marginRight:10,
       borderRadius:10,

    borderColor:'black',
    borderWidth:1,

  },
  postbodyinput:{
    fontSize:15,
    paddingTop:10,
    textAlignVertical:'top',
       paddingHorizontal:10


  },
  posttop:{
    flexDirection:'row',
    justifyContent:'flex-end'
  },
  topbutton:{
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'black',
    width:100,
    borderRadius:15,
    margin:10,

  },
  toptext:{
    color:'white',
    fontSize:17,
    padding:5

  }
});
export default AddPostScreen

