import React, { useEffect, useLayoutEffect, useState } from "react";

import { Text, View, StyleSheet, FlatList, TouchableOpacity,ScrollView } from "react-native";
import ArticleCard from "../components/ArticleCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SavedPostsScreen = ({ navigation }) => {
     const ClearSavedPosts = () => {
          AsyncStorage.removeItem('posts',(err,posts) =>{
               if (err){
                    console.log(err)
               }else {
                    console.warn('Removed',posts)
                    setSavedPosts([])
               }
          })
     }
     useLayoutEffect(() => {
          navigation.setOptions({
               headerTitle:'My Saved Posts',
               headerRight:() => {
                    return(
                         <TouchableOpacity onPress={ClearSavedPosts} style={{ paddingRight:20 }}>
                              <Text style={{ fontSize:16,fontWeight:'bold' }}>Clear All </Text>
                         </TouchableOpacity>
                    )
               }
          })
     })
     const [savedPosts,setSavedPosts] = useState([])
     const FetchSavedPosts = () => {
          AsyncStorage.getItem('posts',(err,posts) =>{
               if (err){
                    console.log(err)
               }else {
                    console.log(JSON.parse(posts).map(post => post.id));
                    setSavedPosts(JSON.parse(posts))
               }
          })
     }
     useEffect(() => {
          FetchSavedPosts()
     }, []);
     navigation.addListener('focus',() => {
          FetchSavedPosts()

     })

     return (
       <View style={styles.container}>
            { savedPosts.length === 0 && (<Text style={{ textAlign:'center',marginTop:100 }}>You have no saved Posts yet</Text>)}
            <FlatList
                 data={savedPosts}
                 keyExtractor={( item ) => item.id}
                 renderItem={({ item }) => {
                      return (
                           <ArticleCard
                                post={item}
                                postImageUrl={item.post_imageUrl}
                                posttitle={item.post_title}
                                postBody={item.post_body}
                                views={item.views}
                                likes={item.likes}
                                postedAt={item.posted_at}
                                postedBy={item.posted_by}
                                postedOn={item.posted_on}
                                isSavedPostScreen={true}
                           />
                      )
                 }}/>
       </View>
     );
};
const styles = StyleSheet.create({
     container: {
          flex: 1,

          justifyContent: "center",

     },
});
export default SavedPostsScreen;
{/*<FlatList*/}
{/*     data={savedPosts}*/}
{/*     keyExtractor={(post) => post.id}*/}
{/*     renderItem={(post) => {*/}
{/*          return(*/}
{/*               <ArticleCard*/}
{/*                    post={post}*/}
{/*                    postImageUrl={post.item.post_imageUrl}*/}
{/*                    posttitle={post.item.post_title}*/}
{/*                    postBody={post.item.post_body}*/}
{/*                    views={post.item.views}*/}
{/*                    likes={post.item.likes}*/}
{/*                    postedAt={post.item.posted_at}*/}
{/*                    postedBy={post.item.posted_by}*/}
{/*                    postedOn={post.item.posted_on}*/}
{/*               />)*/}
{/*     }}/>*/}
