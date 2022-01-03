import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { Divider, FAB } from "react-native-elements";
import AntDesign from "react-native-vector-icons/AntDesign";
import { SearchBar } from "react-native-elements";
import axios from "axios";
import BaseURL from "../components/BaseURL";
import ArticleCard from "../components/ArticleCard";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Text } from "native-base";
import ActivityLoader from "../components/ActivityLoader";


const HomeScreen = ({ navigation }) => {
     const [posts,setPosts] = useState([])
     const [Loader,setLoader] = useState(false)
     const GoToAddPostScreen = () => {
          navigation.navigate('AddPostScreen',{ draft:{} })
     }

     const GoToSearchScreen = () => {
          navigation.navigate('SearchScreen')
     }
     useLayoutEffect(() => {

          navigation.setOptions({
               headerTitle:'My Story',
               headerRight:() => {
                    return(
                         <TouchableOpacity style={{ marginRight:30 }} onPress={GoToSearchScreen}>
                              <FontAwesome5 name='search' size={26}/>
                         </TouchableOpacity>
                    )
               }
          })
     },[])
     const FetchPosts = () =>{
          setLoader(true)
          axios.get(`${BaseURL}/post/all`)
               .then((res) => {
                    setLoader(false)
                    setPosts(res.data.posts.sort((a,b) => b.id -a.id))
               })
               .catch((err) => {
                    console.warn(err)
               })
     }
     useEffect(() => {
          FetchPosts()
     }, []);
     navigation.addListener('focus',() => {
          FetchPosts()
     })

     return (

       <View style={styles.container}>
            <ActivityLoader isLoading={Loader}/>
            <ScrollView>
                 <Text style={{ marginHorizontal:20,fontSize:25,fontWeight:'bold',paddingTop:10, }}>Latest Posts</Text>
                 <Divider orientation='horizontal' width={2} style={{
                      marginHorizontal:20
                 }}/>
                 <View>
                      {
                           posts.map((post,index) => {
                                return(
                                     <ArticleCard key={index}
                                          post={post}
                                          postImageUrl={post.post_imageUrl}
                                          posttitle={post.post_title}
                                          postBody={post.post_body}
                                          views={post.views}
                                          likes={post.likes}
                                          postedAt={post.posted_at}
                                          postedBy={post.posted_by}
                                          postedOn={post.posted_on}
                                     />
                                )
                           })
                      }
                 </View>
            </ScrollView>
                 <FAB
                      style={styles.fab} onPress={GoToAddPostScreen}
                      color='black'
                      title={<AntDesign name='plus' size={30} color='white'/>}
                      size='large'
                 />
       </View>

     );
};
const styles = StyleSheet.create({
     container: {
          flex: 1,
     },
     fab:{
          position:'absolute',
          top:Dimensions.get('screen').height * 0.68,
          left:Dimensions.get('screen').width * 0.8,
          justifyContent:'center',
          alignItems:'center',


     }
});
export default HomeScreen;
{/*<FlatList*/}
{/*  data={posts}*/}
{/*  keyExtractor={(post) => post.id}*/}
{/*  renderItem={(post) => {*/}

{/*       return(*/}
{/*         <ArticleCard*/}
{/*              post={post}*/}
{/*             postImageUrl={post.item.post_imageUrl}*/}
{/*             posttitle={post.item.post_title}*/}
{/*             postBody={post.item.post_body}*/}
{/*             views={post.item.views}*/}
{/*             likes={post.item.likes}*/}
{/*             postedAt={post.item.posted_at}*/}
{/*             postedBy={post.item.posted_by}*/}
{/*             postedOn={post.item.posted_on}*/}
{/*         />)*/}
{/*  }}/>*/}
