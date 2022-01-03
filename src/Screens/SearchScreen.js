import React, { useLayoutEffect, useState } from "react";

import { Text, View, StyleSheet, TextInput, FlatList } from "react-native";
import { Searchbar } from "react-native-paper";
import ArticleCard from "../components/ArticleCard";
import axios from "axios";
import BaseURL from "../components/BaseURL";
import UserCard from "../components/UserCard";

const SearchScreen = ({ navigation }) => {
     const [query,setQuery] = useState('')
     const [searchPosts,setSearchPosts] = useState([])
     const [searchUsers,setSearchUsers] = useState([])
     const SearchArticles = (text) => {
          axios.get(`${BaseURL}/search?query=${text}`)
               .then((res) => {
                    setSearchPosts(res.data.postsearchresults)
                    setSearchUsers(res.data.usersearchresults)
               })
               .catch((err) =>{
                    console.log(err)
               })
     }
     useLayoutEffect(() => {
          navigation.setOptions({
               header:() => {
                    return(
                         <Searchbar
                              style={{ height:60,fontSize:20}}
                              placeholder='Search....'

                              onChangeText={SearchArticles}
                         />
                    )
               }
          })
     },[]);


     return (
          <View style={styles.container}>
               {
                    searchPosts.length === 0 ? (<Text>No Posts Results Found</Text>):(
                         <FlatList
                              data={searchPosts}
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
                    )
               }
               {
                    searchUsers.length === 0 ? (<Text>No User Results Found</Text>):(
                         <FlatList
                              data={searchUsers}
                              keyExtractor={(user) => user.id}
                              renderItem={(user) => {
                                   return(
                                        <UserCard user={user.item}/>)
                              }}/>
                    )
               }

          </View>
     );
};
const styles = StyleSheet.create({
     container: {
          flex: 1,
          alignItems: "center",
          paddingBottom:5,


     },
     searchField:{
          fontSize:19,
          paddingTop:5
     }
});
export default SearchScreen;
