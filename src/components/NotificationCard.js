import React from "react";
import { Text,  StyleSheet, TouchableOpacity,Dimensions,View } from "react-native";
import { Avatar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import BaseURL from "./BaseURL";

const NotificationCard = ({ notificationType,notificationInitiator,comment,postId }) => {

     const navigation = useNavigation()
     const GoToPostScreen =() => {
          console.log(notificationType);
          if (notificationType === 'Like'||'Comment' ) {
               console.warn('here');
               axios.get(`${BaseURL}/post/id/${postId}`)
                    .then((res) => {
                         navigation.navigate('PostScreen', {
                              postedBy: res.data.info.username,
                              postTitle: res.data.info.postTitle
                         })
                    })
          }
     }
     return (
          <TouchableOpacity style={styles.container} onPress={GoToPostScreen}>
               {
                    notificationType ==="Like" ? (
                         <View style={styles.LikeNotification}>
                              <Avatar
                                   rounded={true}
                                   source={{ uri:'https://picsum.photos/200/300' }}
                                   avatarStyle={styles.avatar}
                                   size='medium'/>
                              <Text style={styles.likeText}>{notificationInitiator} liked your post</Text>
                         </View>
                    ) : notificationType ==='Comment' ? (
                         <View style={styles.CommentNotification}>
                              <Avatar
                                   rounded={true}
                                   source={{ uri:'https://picsum.photos/200/300' }}
                                   avatarStyle={styles.avatar}
                                   size='medium'
                              />
                              <Text style={styles.commentText}>{notificationInitiator} commented : "{comment}"</Text>
                         </View>
                    ):(
                         <View style={styles.CommentNotification}>
                              <Avatar
                                   rounded={true}
                                   source={{ uri:'https://picsum.photos/200/300' }}
                                   avatarStyle={styles.avatar}
                                   size='medium'
                              />
                              <Text style={styles.commentText}>{notificationInitiator} has started following you.</Text>
                         </View>
                    )
               }
          </TouchableOpacity>
     );
};
const styles = StyleSheet.create({
     container: {
          width:Dimensions.get('screen').width * 0.95,
          height:55,
          padding:20,

          paddingVertical:10,
          marginVertical:7,
          justifyContent:'space-evenly'
     },
     LikeNotification:{
          flexDirection:'row',
          alignItems:'center'
     },
     CommentNotification:{
          flexDirection:'row',
          alignItems:'center',
          marginRight:5,
     },
     avatar:{

     },
     likeText:{
          paddingLeft:10,
          fontSize:16.5

     },
     commentText:{
          paddingLeft:10,
          flexWrap:'wrap',
          fontSize:17,

     }
});
export default NotificationCard;
