import { Share,ToastAndroid } from "react-native";
import  AsyncStorage  from "@react-native-async-storage/async-storage";

const SharePost = async (postTitle,postauthor) => {

     try {
          const result = await Share.share({
               message:`https://www.mystory.com/post/specific?title=${postTitle}&postedBy=${postauthor}`,
          });
          if (result.action === Share.sharedAction) {
               if (result.activityType) {
                    // shared with activity type of result.activityType
               } else {
                    // shared
               }
          } else if (result.action === Share.dismissedAction) {
               // dismissed
          }
     } catch (error) {
          alert(error.message);
     }
}
const ShareAuthorProfile = async (postAuthor) => {
     try {
          const result = await Share.share({
               message:`https://www.mystory.com/author?username=${postAuthor}`,
          });
          if (result.action === Share.sharedAction) {
               if (result.activityType) {
                    // shared with activity type of result.activityType
               } else {
                    // shared
               }
          } else if (result.action === Share.dismissedAction) {
               // dismissed
          }
     } catch (error) {
          alert(error.message);
     }
}
const SavePostToSavedPosts = (post) => {

     AsyncStorage.getItem('posts',(err,posts) => {
          if (err){
               console.log(err)
          }else {
               if (posts === null){
                    AsyncStorage.setItem('posts',JSON.stringify([post]))
                    ToastAndroid.show('This post has been added to your saved Posts',ToastAndroid.SHORT)
               }else {
                    let savedPosts = JSON.parse(posts)
                    let postExists = savedPosts.findIndex((savedPost) => savedPost.id === post.id)
                    if (postExists !== -1){
                         ToastAndroid.show('This post is already saved',ToastAndroid.SHORT)
                    }else {
                         let newSavedPosts = [...savedPosts,post]
                         AsyncStorage.setItem('posts',JSON.stringify(newSavedPosts))
                         ToastAndroid.show('This post has been added to your saved Posts',ToastAndroid.SHORT)
                    }


               }

          }
     })


}
function capitalize(str){
     const lower = str.toLowerCase()
     return str.charAt(0).toUpperCase() + lower.slice(1)
}
export { SharePost,SavePostToSavedPosts,ShareAuthorProfile,capitalize }
